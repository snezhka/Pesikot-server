import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class EmailSignInDto {
  @IsEmail({}, { message: 'Please enter a valid email.' })
  email: string;

  @IsString() // Ensures the password is a string
  @IsNotEmpty({ message: 'Password is required.' }) // Ensures the password is not empty
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;
}
