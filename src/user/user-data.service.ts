import { IForgotPassword, ISignInRequest } from './../utils/interfaces/auth';
import { Injectable } from '@nestjs/common';
import { IUser, IUserByEmailWhereQuery, IUserByUsernameWhereQuery, IUserByIdWhereQuery, IUserByPhoneNumberWhereQuery, IUserCreateByPhoneNumber } from '../utils/interfaces/user';

import { PrismaClient } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library';
const prisma = new PrismaClient()

@Injectable()
export class UserDataService {

    async create(data: ISignInRequest): Promise<IUser> {
        let where;
        if (data.type == 'phone') {
            where = {
                email: "",
                username: "",
                password: "",
                phoneNumber: data.phoneNumber
            }
        } else {
            where = {
                email: data.email,
                username: data.username,
                password: data.password,
                phoneNumber: ""
            }
        }
        const user = await prisma.user.create({
            data: where
        });
        return user
    }

    async update(where: IUserByEmailWhereQuery | IUserByIdWhereQuery, data: any): Promise<void> {
        try {
            await prisma.user.update({ where: where, data: data });
        } catch (err: any) {
            throw new Error(err.message)
        }
    }


    async findUserByAnyField(where: Record<string, any>): Promise<IUser | null> {
        const user = await prisma.user.findFirst({
            where: where
        })
        return user;
    }

    async findUniqueByPhoneNumber(where: IUserByPhoneNumberWhereQuery): Promise<IUser | null> {
        const user = await prisma.user.findFirst({
            where: where
        });
        return user;
    }

    async findUniqueByEmail(where: IUserByEmailWhereQuery): Promise<IUser | null> {
        const user = await prisma.user.findUnique({
            where: where
        })
        return user;
    }

    async findUniqueByUsername(where: IUserByUsernameWhereQuery): Promise<IUser | null> {
        const user = await prisma.user.findUnique({
            where: where
        })
        return user;
    }

    // async findUniqueByToken(token: string): Promise<IUser> {
    //     const user = await prisma.user.findFirst({
    //         where: {
    //             metadata: {
    //                 path: ['resetToken'],  // Specify the path to the resetToken inside the JSON object
    //                 equals: token,
    //             },
    //         },
    //     });

    //     if (!user) {
    //         throw new Error('User with the provided reset token does not exist');
    //     }

    //     return user;
    // }
}
