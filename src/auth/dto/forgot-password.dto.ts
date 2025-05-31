import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
    @IsEmail({}, { message: 'Please enter a valid email.' }) // Validates email format
    @IsNotEmpty({ message: 'Email is required.' }) // Ensures email is provided
    email: string;
}

