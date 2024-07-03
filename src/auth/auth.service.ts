import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IUserCreateRequest } from '../utils/interfaces/user';
import { ISignInRequest, ISignInResponse } from '../utils/interfaces/auth';
import { UserDataService } from '../user/user-data.service';
import { IUser } from '../utils/interfaces/user';
import { hashSync, compare } from 'bcrypt';
import { SALT_ROUNDS } from '../constants';
import {
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userDataService: UserDataService, private jwtService: JwtService) {
    }
    async signUp(data: IUserCreateRequest): Promise<void> {
        const where = {
            email: data.email,
        };
        const res = await this.userDataService.findUnique(where);
        console.log(res);
        if (res) console.log("hello");
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
        const payload = { sub: res.id, username: res.username };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    private async hashString(str: string): Promise<string> {
        return hashSync(str, SALT_ROUNDS)
    }
    private compareHashStrings(hashedString: string, dbHashedString: string): Promise<boolean> {
        return compare(hashedString, dbHashedString)
    }
}