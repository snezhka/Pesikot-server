import { BadRequestException, ConsoleLogger, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { IUserCreateRequest, IUserWhereQuery } from '../utils/interfaces/user';
import { ISignInRequest, ISignInResponse } from '../utils/interfaces/auth';
import { UserDataService } from '../user/user-data.service';
import { IUser } from '../utils/interfaces/user';
import { hashSync, compare } from 'bcrypt';
import { SALT_ROUNDS } from '../constants';
import {
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { SignInUserRequestDto } from './dto/signin-user-request.dto';

@Injectable()
export class AuthService {
    constructor(private userDataService: UserDataService, private jwtService: JwtService) {
    }

    async signUp(data: IUserCreateRequest): Promise<void> {
        console.log('received', data);
        const where = {
            email: data.email,
        };
        const res = await this.userDataService.findUnique(where);
        console.log(res);
        if (res) throw new BadRequestException("User with such email already exists");
        data.password = await this.hashString(data.password);
        return this.userDataService.create(data);
    }

    async signIn(data: ISignInRequest): Promise<ISignInResponse> {
        const where = {
            email: data.email,
        };
        const res = await this.userDataService.findUnique(where);
        if (!res) throw new NotFoundException("User with such email is not found");
        if (!await this.compareHashStrings(data.password, res.password)) throw new UnauthorizedException("UNAUTHORIZED");
        const tokens = await this.getTokens(res.id);
        return tokens;
    }

    async getAccount(data: IUserWhereQuery): Promise<IUser> {
        const where = {
            email: data.email,
        };
        const res = await this.userDataService.findUnique(where);
        if (!res) throw new NotFoundException("Account with such email is not found");
        return res;
    }

    async getAccessToken(refreshToken: string) {
        try {
            //Add refresh token verification
            const payload = await this.jwtService.verifyAsync(
                refreshToken,
                {
                    secret: jwtConstants.JWT_REFRESH_SECRET
                }
            );
            const accessToken = await this.jwtService.signAsync(
                {
                    sub: payload.userId,
                },
                {
                    secret: jwtConstants.JWT_ACCESS_SECRET,
                    expiresIn: '1min',
                },
            );
            return { 'accessToken': accessToken }; // return accessToken
        } catch (err) {

            throw new UnauthorizedException();
        }

    }
    private async hashString(str: string): Promise<string> {
        return hashSync(str, SALT_ROUNDS)
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
                    secret: jwtConstants.JWT_ACCESS_SECRET,
                    expiresIn: '1min',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                },
                {
                    secret: jwtConstants.JWT_REFRESH_SECRET,
                    expiresIn: '7d',
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    // async refreshTokens(data: SignInUserRequestDto, refreshToken: string) {
    //     const where = {
    //         email: data.email,
    //     };
    //     const res = await this.userDataService.findUnique(where);
    //     if (!res)
    //         throw new ForbiddenException('Access Denied');
    //     const refreshTokenMatches = await argon2.verify(
    //         user.refreshToken,
    //         refreshToken,
    //     );
    //     if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    //     const tokens = await this.getTokens(res.id);
    //     await this.updateRefreshToken(res.id, tokens.refreshToken);
    //     return tokens;
    // }

    // async updateRefreshToken(userId: string, refreshToken: string) {
    //     const hashedRefreshToken = await this.hashString(refreshToken);
    // Update in Cookies
    // await this.usersService.update(userId, {
    //     refreshToken: hashedRefreshToken,
    // });
    //}
}