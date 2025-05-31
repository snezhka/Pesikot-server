import { Injectable, NotFoundException } from "@nestjs/common";
import { IUser, IUserByEmailWhereQuery } from "src/utils/interfaces/user";
import { UserDataService } from "./user-data.service";

@Injectable()
export class UserService {
    constructor(private userDataService: UserDataService) {
    }
    async getAccount(data: IUserByEmailWhereQuery): Promise<IUser> {
        const where = {
            email: data.email,
        };
        const res = await this.userDataService.findUniqueByEmail(where);
        if (!res) throw new NotFoundException("Account with such email is not found");
        return res;
    }
}