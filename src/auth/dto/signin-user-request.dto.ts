import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { ISignInRequest } from "src/utils/interfaces/auth";

export class SignInUserRequestDto implements ISignInRequest {
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    // @Matches()
    password!: string;
}