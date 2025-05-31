import { IUserCreateByPhoneNumber, IUserCreateRequest } from "./user";
import { IUserSignInResponse } from "./user";


export interface ISignInPhoneNumber extends IUserCreateByPhoneNumber {

}

export interface ISignUpRequest extends IUserCreateRequest {
    type: 'email'
}

interface ISignInWithEmail extends Pick<IUserCreateRequest, 'username' | 'email' | 'password'> {
    type: 'email';
};

interface ISignInWithPhone extends Pick<IUserCreateRequest, 'phoneNumber'> {
    type: 'phone';
};

export type ISignInRequest = ISignInWithEmail | ISignInWithPhone;

export interface ISignInResponse extends IUserSignInResponse {

}

export interface IAccesTokenResponse extends Pick<IUserSignInResponse, 'accessToken'> {

}

export interface IRefreshTokenRequest extends Pick<IUserSignInResponse, 'refreshToken'> {

}

export interface IForgotPassword extends Pick<IUserCreateRequest, 'email'> {

}

export interface IResetPassword extends Pick<IUserCreateRequest, 'password'> {

}

export interface IUpdatePassword extends Pick<IUserCreateRequest, 'email' | 'password'> {

}