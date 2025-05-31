import { Controller, Get, Post, Body, HttpStatus, HttpCode, Headers, Res, HttpException, Req, Header, BadRequestException } from '@nestjs/common';
import { SignUpUserRequestDto } from './dto/signup-user-request.dto';
import { SignInUserRequestDto } from './dto/signin-user-request.dto';
import { AuthService } from './auth.service';
import { SignInUserResponseDto } from './dto/signin-user-response.dto';
import { Public } from 'src/utils/decorators';
import { AccessResponseDto } from './dto/access.dto.response';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Response } from 'express';

@Controller()
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('sign-up')
    async signUp(
        @Body() signUpUserDto: SignUpUserRequestDto
    ) {
        console.log(signUpUserDto);
        await this.authService.signUp(signUpUserDto);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    async signIn(
        @Body() signInUserDto: SignInUserRequestDto
    ) {
        console.log(signInUserDto);
        const res = await this.authService.signIn(signInUserDto);
        return new SignInUserResponseDto(res);
    }

    @Public()
    @Get('refresh')
    async getAccessToken(@Headers('refresh-token') refreshDto: string) {
        const res = await this.authService.getAccessToken(refreshDto)
        return new AccessResponseDto(res);
    }

    @Public()
    // Endpoint to handle the Forgot Password request
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto, @Headers('host') host: string, @Res() res: Response) {
        // Check if the user exists
        try {
            await this.authService.sendResetPasswordEmail(forgotPasswordDto, host, res);
        } catch (error: any) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to handle password reset with the token
    @Post('reset-password')
    async resetPassword(
        @Body() resetPasswordDto: ResetPasswordDto,
        @Res() res: Response,
        @Headers('reset-token') resetToken: string
    ) {
        console.log("Reset token", resetToken)
        const email = await this.authService.validateResetToken(resetToken);
        if (!email) {
            throw new BadRequestException(HttpStatus.BAD_REQUEST);
        }
        await this.authService.updatePassword({ email: email, password: resetPasswordDto.newPasswordConfirm });
    }
}
