import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter.',
  })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter.',
  })
  @Matches(/[0-9]/, { message: 'Password must contain at least one number.' })
  @Matches(/[^a-zA-Z0-9]/, {
    message: 'Password must contain at least one special character.',
  })
  @IsString()
  @IsNotEmpty()
  newPasswordConfirm: string;
}
