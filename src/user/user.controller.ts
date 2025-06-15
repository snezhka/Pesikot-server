import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserResponseDto } from './dto/user.response.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private authService: UserService) {}
  @UseGuards(AuthGuard)
  @Post('account') //change to Get
  @HttpCode(HttpStatus.OK)
  async getAccount(@Body() data: any) {
    //read userId from token
    console.log(data);
    const res = await this.authService.getAccount(data);
    return new UserResponseDto(res);
  }
}
