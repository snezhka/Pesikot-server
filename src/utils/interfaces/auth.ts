import { IUserCreateRequest } from './user';
import { IUserSignInResponse } from './user';

export interface ISignUpRequest extends IUserCreateRequest {}

export interface ISignInRequest extends IUserCreateRequest {}

export interface ISignInResponse extends IUserSignInResponse {}

export interface IAccesTokenResponse
  extends Pick<IUserSignInResponse, 'accessToken'> {}

export interface IRefreshTokenRequest
  extends Pick<IUserSignInResponse, 'refreshToken'> {}

export interface IForgotPassword extends Pick<IUserCreateRequest, 'email'> {}

export interface IResetPassword extends Pick<IUserCreateRequest, 'password'> {}

export interface IUpdatePassword
  extends Pick<IUserCreateRequest, 'email' | 'password'> {}
