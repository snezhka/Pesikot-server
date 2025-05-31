import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ISignInRequest, ISignUpRequest } from '../utils/interfaces/auth';
import { ISignInResponse, IForgotPassword, IUpdatePassword } from '../utils/interfaces/auth';
import { UserDataService } from '../user/user-data.service';
import { hashSync, compare } from 'bcrypt';
import {
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { Response } from 'express';
import { Request } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { validateToken } from 'src/utils/common';
import { SmsService } from 'src/sms/sms.service';

@Injectable()
export class AuthService {
    constructor(
        private userDataService: UserDataService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private emailService: EmailService,
        private smsService: SmsService) {
    }

    async signUp(data: ISignUpRequest): Promise<void> {
        const whereEmail = { email: data.email };

        const resEmail = await this.userDataService.findUniqueByEmail(whereEmail);
        console.log("Existing user", resEmail);

        if (resEmail) {
            throw new BadRequestException("User with such email already exists");
        }
        else {
            if (data.username) {
                const whereUsername = { username: data.username };
                const resUsername = await this.userDataService.findUniqueByUsername(whereUsername);
                if (resUsername) {
                    throw new BadRequestException("User with such username already exists");
                }
            }
        }
        data.password = await this.hashString(data.password);
        try {
            this.userDataService.create(data);
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    // Unique constraint violation error
                    throw new BadRequestException("User with such email or username already exists");
                }
            }
            // Other errors can be handled here if necessary
            console.log("Caught error", err.message)
        }
    }

    async signIn(data: ISignInRequest): Promise<ISignInResponse> {
        let where;
        let res;
        if (data.type == 'phone') {
            where = {
                phoneNumber: data.phoneNumber,
            };
            res = await this.userDataService.findUniqueByPhoneNumber(where);
            console.log("Phone in DB", res);
            if (!res) {
                this.userDataService.create(data);
            }
            this.smsService.sendSms(data.phoneNumber);
        } else {
            where = {
                email: data.email,
            };
            res = await this.userDataService.findUniqueByEmail(where);
            if (!res) throw new NotFoundException("User with such email is not found");
            if (!await this.compareHashStrings(data.password, res.password)) throw new UnauthorizedException("UNAUTHORIZED");
        }
        const tokens = await this.getTokens(res.id);
        return tokens;
    }

    async getAccessToken(refreshToken: string) {
        try {
            const payload = await validateToken(refreshToken, process.env.JWT_REFRESH_SECRET);
            const accessToken = await this.jwtService.signAsync(
                {
                    sub: payload.email,
                },
                {
                    secret: process.env.JWT_ACCESS_SECRET,
                    expiresIn: '1min',
                },
            );
            return { 'accessToken': accessToken };
        } catch (err) {
            throw new UnauthorizedException(err);
        }

    }
    private async hashString(str: string): Promise<string> {
        return hashSync(str, Number(process.env.SALT_ROUNDS));
    }

    private compareHashStrings(hashedString: string, dbHashedString: string): Promise<boolean> {
        return compare(hashedString, dbHashedString)
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

    async sendResetPasswordEmail(data: IForgotPassword, host: string, res: Response): Promise<string> {
        const where = {
            email: data.email,
        };
        const user = await this.userDataService.findUniqueByEmail(where);
        if (!user) {
            throw new Error('User not found');
        }

        const payload = { sub: data.email }; // Add URL pf frontend to it
        //One time token
        const token = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: '15m', // Token expires in 15 minutes
        });
        console.log("Token", token);

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
                    email: data.email
                },
                {
                    metadata: {
                        resetToken: token,
                    },
                }
            );
            await this.emailService.sendEmail(emailData);
            return resetLink;
        } catch (error) {
            throw new Error('Error sending email');
        }
    }

    // Verify the token and extract email for password reset
    async validateResetToken(token: string): Promise<string> {
        const decodedToken = await validateToken(token, process.env.JWT_ACCESS_SECRET);
        const email = decodedToken.sub;
        console.log("Email", email);
        const user = await this.userDataService.findUserByAnyField({ email: email });
        console.log("User", user);
        if (user.metadata && typeof user.metadata === 'object') {
            const dbToken = (user.metadata as Record<string, any>).resetToken;
            if (!dbToken) {
                throw new HttpException('The token has been invalidated. Please request a new password reset link.', HttpStatus.BAD_REQUEST);
            } else if (token !== dbToken) {
                throw new HttpException('The token has been re-generated. Please use the latest password reset link.', HttpStatus.BAD_REQUEST);
            }
            return email;
        }
    }

    async updatePassword(data: IUpdatePassword) {
        console.log("data", data);
        const where = {
            email: data.email,
        };
        // const hashedPassword = await this.hashString(data.password);
        await this.userDataService.update(where, {
            password: data.password, metadata: {
                resetToken: null,
            },
        });
    }
}
