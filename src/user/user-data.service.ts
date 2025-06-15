import { ISignInRequest } from './../utils/interfaces/auth';
import { Injectable } from '@nestjs/common';
import { IUser, IUserWhereQuery } from '../utils/interfaces/user';

import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class UserDataService {
  async create(data: ISignInRequest): Promise<IUser | null> {
    const user = await prisma.user.create({
      data: data,
    });
    return user;
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<void> {
    try {
      await prisma.user.update({ where: where, data: data });
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async findUniqueUser(where: IUserWhereQuery): Promise<IUser | null> {
    const user = await prisma.user.findFirst({
      where: where,
    });
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
