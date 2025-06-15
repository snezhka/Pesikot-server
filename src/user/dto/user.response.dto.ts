import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IUser } from 'src/utils/interfaces/user';
import { BaseResponseDto } from '../../utils/base-response.dto';

export class UserResponseDto extends BaseResponseDto<IUser> implements IUser {
  @Exclude()
  id: number;

  @Exclude()
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
