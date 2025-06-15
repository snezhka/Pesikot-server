import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Headers,
  Res,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { SignUpUserRequestDto } from './dto/signup-user-request.dto';
import { SignInUserRequestDto } from './dto/signin-user-request.dto';
import { AuthService } from './auth.service';
import { SignInUserResponseDto } from './dto/signin-user-response.dto';
import { Public } from 'src/utils/decorators';
import { AccessResponseDto } from './dto/access.dto.response';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Response } from 'express';
import { ActivateCodeDto } from 'src/sms/dto/activate.code.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpUserDto: SignUpUserRequestDto) {
    console.log(signUpUserDto);
    const {
      provider,
      data: { passwordConfirm: _passwordConfirm, ...data },
    } = signUpUserDto;
    const userData = { data, provider };
    await this.authService.signUp(userData);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Body() signInUserDto: SignInUserRequestDto,
  ): Promise<SignInUserResponseDto | string> {
    console.log(signInUserDto);
    const { provider, data } = signInUserDto;
    const userData = { provider, ...data };
    const res = await this.authService.signIn(userData);
    if (typeof res === 'string') {
      return res;
    }
    return new SignInUserResponseDto(res);
  }

  @Public()
  @Get('refresh')
  async getAccessToken(@Headers('refresh-token') refreshDto: string) {
    const res = await this.authService.getAccessToken(refreshDto);
    return new AccessResponseDto(res);
  }

  @Public()
  // Endpoint to handle the Forgot Password request
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Headers('host') host: string,
    @Res() res: Response,
  ) {
    // Check if the user exists
    try {
      await this.authService.sendResetPasswordEmail(
        forgotPasswordDto,
        host,
        res,
      );
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Endpoint to handle password reset with the token
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
    @Headers('reset-token') resetToken: string,
  ) {
    console.log('Reset token', resetToken);
    const email = await this.authService.validateResetToken(resetToken);
    if (!email) {
      throw new BadRequestException(HttpStatus.BAD_REQUEST);
    }
    await this.authService.updatePassword({
      email: email,
      password: resetPasswordDto.newPasswordConfirm,
    });
  }

  @Public()
  @Post('activate')
  async activateCode(@Body() activateCodeDto: ActivateCodeDto) {
    return this.authService.activateCode(activateCodeDto);
  }
}
