import { IsPhoneNumber } from 'class-validator';

export class PhoneSignInDto {
  @IsPhoneNumber('UA', { message: 'Please enter a valid phone number.' })
  phoneNumber: string;
}
