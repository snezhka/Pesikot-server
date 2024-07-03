export interface IUser {
    id: number;
    username: string;
    email: string;
    password: string;
}

export interface IUserCreateRequest {
    username?: string;
    email: string;
    password: string;
}

export interface IUserSignInResponse {
    access_token: string;
}

export interface IUserWhereQuery {
    email: string;
    username?: string;
}