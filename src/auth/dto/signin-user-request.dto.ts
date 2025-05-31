import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength, ValidateIf } from "class-validator";

export class SignInUserRequestDto {

    @IsString()
    type: 'email' | 'phone';

    @ValidateIf((o) => o.type === 'email')
    @IsEmail({}, { message: 'Please enter a valid email.' })
    email: string;

    @ValidateIf((o) => o.type === 'phone')
    @IsPhoneNumber('UA', { message: 'Please enter a valid phone number.' })
    phoneNumber: string;

    @ValidateIf((o) => o.type === 'email')
    @IsString() // Ensures the password is a string
    @IsNotEmpty({ message: 'Password is required.' }) // Ensures the password is not empty
    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
    password: string;
}