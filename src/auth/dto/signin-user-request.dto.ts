import { BadRequestException } from '@nestjs/common';
import { AuthProvider, HttpCode } from 'src/utils/constants';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmptyObject,
  ValidateNested,
  validateSync,
} from 'class-validator';

import { EmailSignInDto } from './email-sign-in.dto';
import { PhoneSignInDto } from './phone-sign-in.dto';
import { ExternalSignInDto } from './external-sign-in.dto';
import { ISignInRequest } from 'src/utils/interfaces/auth';

export class SignInUserRequestDto implements ISignInRequest {
  @IsEnum(AuthProvider)
  provider: AuthProvider = AuthProvider.Email;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type((helper) => {
    const errors = validateSync(helper?.newObject);

    if (errors && errors.length) {
      const providerError = errors.find(
        (error) => error.property === 'provider',
      );
      if (providerError)
        throw new BadRequestException(
          Object.values(providerError.constraints!),
        );
    }

    switch (helper?.newObject.provider) {
      case AuthProvider.Email:
        return EmailSignInDto;
      case AuthProvider.Phone:
        return PhoneSignInDto;
      case AuthProvider.External:
        return ExternalSignInDto;

      default:
        throw new BadRequestException(HttpCode.UnsupportedOperation);
    }
  })
  data!: EmailSignInDto | PhoneSignInDto | ExternalSignInDto;
}
