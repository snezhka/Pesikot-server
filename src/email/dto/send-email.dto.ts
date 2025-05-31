import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ISendEmail } from "src/utils/interfaces/email";

export class SendEmailDto implements ISendEmail {
    @IsString()
    @IsEmail()
    from: string;
    @IsString()
    @IsEmail()
    to: string;  // The recipient's email
    @IsString()
    @IsNotEmpty()
    subject: string;  // The subject of the email
    @IsOptional()
    html?: string;  // The HTML content (optional)
}


