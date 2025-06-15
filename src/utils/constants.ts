export const RESET_TOKEN_EXPIRATION_MILLISEC = 900000;
export enum AuthProvider {
  Email = 'email',
  Phone = 'phone',
  External = 'external',
}

export enum HttpCode {
  Ok = 200,
  BadRequest = 400,
  Unauthorized = 401,
  UnsupportedOperation = 422,
}
