import { IUserCreateRequest } from "./user";
import { IUserSignInResponse } from "./user";

export interface ISignUpRequest extends IUserCreateRequest {

}

export interface ISignInRequest extends Pick<IUserCreateRequest, 'email' | 'password'> {

}

export interface ISignInResponse extends IUserSignInResponse {

}
