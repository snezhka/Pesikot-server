import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ISignUpRequest } from '../../utils/interfaces/auth';

class UserDataDto {
  @IsOptional()
  @IsString()
  @Length(3, 10, {
    message: 'Username must be between 3 and 10 characters long.',
  })
  username?: string;

  @IsEmail({}, { message: 'Please enter a valid email.' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password!: string;

  @IsString()
  @IsNotEmpty()
  // @IsIn([Math.random()], {
  //     message: 'Passwords do not match',
  // })
  @ValidateIf((o) => o.password !== o.passwordConfirm)
  passwordConfirm!: string;
}

export class SignUpUserRequestDto implements ISignUpRequest {
  @IsString()
  provider: 'email';

  @ValidateNested()
  @Type(() => UserDataDto)
  data: UserDataDto;
}
