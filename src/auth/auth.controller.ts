import { Controller, Get, Post, Param, Body, HttpException, HttpStatus, UsePipes, HttpCode, UseGuards, Request, } from '@nestjs/common';
import { SignUpUserRequestDto } from './dto/signup-user-request.dto';
import { SignInUserRequestDto } from './dto/signin-user-request.dto';
import { AuthService } from './auth.service';
import { SignInUserResponseDto } from './dto/signin-user-response.dto';
import { AuthGuard } from './auth.guard';
import { Public } from 'src/user/user.decorator';

@Controller()
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('sign-up')
    async signUp(
        @Body() signUpUserDto: SignUpUserRequestDto
    ) {
        await this.authService.signUp(signUpUserDto);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    async signIn(
        @Body() signInUserDto: SignInUserRequestDto
    ) {
        const res = await this.authService.signIn(signInUserDto);
        return new SignInUserResponseDto(res);
    }

    // @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        console.log(req.user);
        return req.user;
    }
}
