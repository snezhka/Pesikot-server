import { Module } from '@nestjs/common';
import { UserDataService } from './user-data.service';

@Module({
    providers: [UserDataService],
    exports: [UserDataService]
})
export class UserModule { }