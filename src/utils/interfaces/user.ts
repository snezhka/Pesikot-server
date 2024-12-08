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
    accessToken: string;
    refreshToken: string;
}

export interface IUserWhereQuery {
    id?: number;
    email: string;
    username?: string;
}