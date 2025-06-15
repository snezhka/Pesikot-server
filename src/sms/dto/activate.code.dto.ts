import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class ActivateCodeDto {
  @IsPhoneNumber('UA', { message: 'Please enter a valid phone number.' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
