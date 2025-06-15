import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from 'src/utils/interfaces/user';
import { UserDataService } from './user-data.service';

@Injectable()
export class UserService {
  constructor(private userDataService: UserDataService) {}
  async getAccount(data: any): Promise<IUser> {
    const where = {
      email: data.email,
    };
    const res = await this.userDataService.findUniqueUser(where);
    if (!res)
      throw new NotFoundException('Account with such email is not found');
    return res;
  }
}
