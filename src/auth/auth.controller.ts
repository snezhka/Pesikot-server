import { Controller, Get, Post, Param, Body, HttpException, HttpStatus, UsePipes, HttpCode, UseGuards, Request, Req, Headers } from '@nestjs/common';
import { SignUpUserRequestDto } from './dto/signup-user-request.dto';
import { SignInUserRequestDto } from './dto/signin-user-request.dto';
import { AuthService } from './auth.service';
import { SignInUserResponseDto } from './dto/signin-user-response.dto';
import { AuthGuard } from './auth.guard';
import { Public } from 'src/user/user.decorator';
import { IUserWhereQuery } from 'src/utils/interfaces/user';

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
        const res = await this.authService.signIn(signInUserDto);
        return new SignInUserResponseDto(res);
    }

    @Public()
    @Get('refresh')
    async getAccessToken(@Headers('refresh-token') refreshToken: string) {
        const tokens = await this.authService.getAccessToken(refreshToken)
        return tokens; //add Request and Response DTO
    }

    //Move to User controller (service)
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('account')
    async getProfile(@Body() data: IUserWhereQuery) {
        const res = await this.authService.getAccount(data);
        return res;
    }
}
