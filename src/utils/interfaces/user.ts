import { JsonValue } from '@prisma/client/runtime/library';

export interface IUser {
  id: number;
  username?: string;
  phoneNumber?: string;
  email: string;
  password: string;
  metadata?: JsonValue | null;
}

export interface IUserCreateRequest {
  provider: 'email' | 'phone' | 'external';
  username?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
}

export interface IUserSignInResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IUserWhereQuery {
  id?: number;
  username?: string;
  email?: string;
  phoneNumber?: string;
}
