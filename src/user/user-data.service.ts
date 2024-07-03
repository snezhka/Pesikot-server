import { Injectable } from '@nestjs/common';
import { IUser, IUserCreateRequest, IUserWhereQuery } from '../utils/interfaces/user';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

@Injectable()
export class UserDataService {

    async create(data: IUserCreateRequest): Promise<void> {
        await prisma.user.create({ data });
    }

    async findUnique(where: IUserWhereQuery): Promise<IUser> {
        const user = await prisma.user.findUnique({
            where
        })
        return user;
    }
}
