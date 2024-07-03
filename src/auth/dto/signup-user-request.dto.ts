import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";
import { ISignUpRequest } from "../../utils/interfaces/auth";

export class SignUpUserRequestDto implements ISignUpRequest {
    @IsString()
    @Length(3, 10)
    @IsOptional()
    username?: string;

    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{7,})/)
    password!: string;
}
