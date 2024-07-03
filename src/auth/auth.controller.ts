import { Controller, Get, Post, Param, Body, HttpException, HttpStatus, UsePipes, HttpCode } from '@nestjs/common';
import { SignUpUserRequestDto } from './dto/signup-user-request.dto';
import { SignInUserRequestDto } from './dto/signin-user-request.dto';
import { AuthService } from './auth.service';
import { SignInUserResponseDto } from './dto/signin-user-response.dto';

@Controller()
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('sign-up')
    async signUp(
        @Body() signUpUserDto: SignUpUserRequestDto
    ) {
        await this.authService.signUp(signUpUserDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    async signIn(
        @Body() signInUserDto: SignInUserRequestDto
    ) {
        const res = await this.authService.signIn(signInUserDto);
        return new SignInUserResponseDto(res);
    }
}
