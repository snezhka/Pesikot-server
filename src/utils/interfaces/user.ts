import { JsonValue } from "@prisma/client/runtime/library";

export interface IUser {
    id: number;
    username?: string;
    phoneNumber?: string,
    email: string;
    password: string;
    metadata?: JsonValue | null;

}

export interface IUserCreateRequest {
    username?: string;
    email?: string;
    phoneNumber?: string;
    password: string;
    passwordConfirm: string;
    metadata?: JsonValue | null;
}

export interface IUserCreateByPhoneNumber {
    phoneNumber: string,
}

export interface IUserCreateByPhoneNumber {
    phoneNumber: string;
}

export interface IUserSignInResponse {
    accessToken: string;
    refreshToken: string;
}


export interface IUserByEmailWhereQuery {
    email: string;
}

export interface IUserByUsernameWhereQuery {
    username: string;
}

export interface IUserByPhoneNumberWhereQuery {
    phoneNumber: string;
}

export interface IUserByIdWhereQuery {
    id: number;
}

