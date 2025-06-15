import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { ISignInRequest } from '../utils/interfaces/auth';
import {
  ISignInResponse,
  IForgotPassword,
  IUpdatePassword,
} from '../utils/interfaces/auth';
import { UserDataService } from '../user/user-data.service';
import { hashSync, compare } from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { validateToken } from 'src/utils/common';
import { SmsService } from 'src/sms/sms.service';
import { ActivateCodeDto } from 'src/sms/dto/activate.code.dto';

@Injectable()
export class AuthService {
  constructor(
    private userDataService: UserDataService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private smsService: SmsService,
  ) {}

  async signUp({ provider, data }): Promise<void> {
    const whereEmail = { email: data.email };

    const resEmail = await this.userDataService.findUniqueUser(whereEmail);
    console.log('Existing user', resEmail);

    if (resEmail) {
      throw new BadRequestException('User with such email already exists');
    } else {
      if (data.username) {
        const whereUsername = { username: data.username };
        const resUsername =
          await this.userDataService.findUniqueUser(whereUsername);
        if (resUsername) {
          throw new BadRequestException(
            'User with such username already exists',
          );
        }
      }
    }
    data.password = await this.hashString(data.password);
    data.provider = provider;
    try {
      this.userDataService.create(data);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          // Unique constraint violation error
          throw new BadRequestException(
            'User with such email or username already exists',
          );
        }
      }
      // Other errors can be handled here if necessary
      console.log('Caught error', err.message);
    }
  }

  async signIn(data: ISignInRequest): Promise<ISignInResponse | string> {
    console.log('qqq', data);
    const where = {
      email: data.email,
      phoneNumber: data.phoneNumber,
    };
    let res = await this.userDataService.findUniqueUser(where);
    console.log('User', res);
    switch (data.provider) {
      case 'phone':
        if (!res) {
          res = await this.userDataService.create(data);
        }
        const code = await this.smsService.sendSms(data.phoneNumber);
        await this.userDataService.update(where, { metadata: { code: code } });
        return 'Message sent!';
      case 'email':
        if (!res)
          throw new NotFoundException('User with such email is not found');
        if (!(await this.compareHashStrings(data.password, res.password)))
          throw new UnauthorizedException('UNAUTHORIZED');
        const tokens = await this.getTokens(res?.id);
        return tokens;
      case 'external':
        throw new NotImplementedException(
          'The external provider currently is not available',
        );
    }
  }

  async getAccessToken(refreshToken: string) {
    try {
      const payload = await validateToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
      );
      const accessToken = await this.jwtService.signAsync(
        {
          sub: payload.email,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '1min',
        },
      );
      return { accessToken: accessToken };
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
  private async hashString(str: string): Promise<string> {
    return hashSync(str, Number(process.env.SALT_ROUNDS));
  }

  private compareHashStrings(
    hashedString: string,
    dbHashedString: string,
  ): Promise<boolean> {
    return compare(hashedString, dbHashedString);
  }

  private async getTokens(userId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '1min',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async sendResetPasswordEmail(
    data: IForgotPassword,
    host: string,
    res: Response,
  ): Promise<string> {
    const where = {
      email: data.email,
    };
    const user = await this.userDataService.findUniqueUser(where);
    if (!user) {
      throw new Error('User not found');
    }

    const payload = { sub: data.email }; // Add URL pf frontend to it
    //One time token
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m', // Token expires in 15 minutes
    });
    console.log('Token', token);

    // Generate the reset link with token in cookies
    const resetLink = `${host}/reset-password?reset-token=`;

    const emailData = {
      to: data.email,
      from: process.env.SENDGRID_FROM_EMAIL, // Your email address
      subject: 'Reset Your Password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p><p>The link will be available for next 15 minutes</p>`,
    };

    try {
      // Save the latest token to the user's metadata
      await this.userDataService.update(
        {
          email: data.email,
        },
        {
          metadata: {
            resetToken: token,
          },
        },
      );
      await this.emailService.sendEmail(emailData);
      return resetLink;
    } catch (error) {
      throw new Error('Error sending email');
    }
  }

  // Verify the token and extract email for password reset
  async validateResetToken(token: string): Promise<string> {
    const decodedToken = await validateToken(
      token,
      process.env.JWT_ACCESS_SECRET,
    );
    const email = decodedToken.sub;
    console.log('Email', email);
    const user = await this.userDataService.findUniqueUser({ email: email });
    console.log('User', user);
    if (user.metadata && typeof user.metadata === 'object') {
      const dbToken = (user.metadata as Record<string, any>).resetToken;
      if (!dbToken) {
        throw new HttpException(
          'The token has been invalidated. Please request a new password reset link.',
          HttpStatus.BAD_REQUEST,
        );
      } else if (token !== dbToken) {
        throw new HttpException(
          'The token has been re-generated. Please use the latest password reset link.',
          HttpStatus.BAD_REQUEST,
        );
      }
      return email;
    }
  }

  async updatePassword(data: IUpdatePassword) {
    console.log('data', data);
    const where = {
      email: data.email,
    };
    // const hashedPassword = await this.hashString(data.password);
    await this.userDataService.update(where, {
      password: data.password,
      metadata: {
        resetToken: null,
      },
    });
  }

  async activateCode(data: ActivateCodeDto) {
    const where = {
      phoneNumber: data.phoneNumber,
    };
    const user = await this.userDataService.findUniqueUser(where);
    if (user && data.code == user.metadata['code']) {
      await this.userDataService.update(where, { metadata: { code: null } });
      const tokens = await this.getTokens(user.id);
      return tokens;
    }
    throw new UnauthorizedException('Activation code is not correct');
  }
}
