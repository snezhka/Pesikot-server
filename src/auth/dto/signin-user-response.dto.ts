import { IsNotEmpty, IsString } from 'class-validator';
import { ISignInResponse } from 'src/utils/interfaces/auth';
import { BaseResponseDto } from '../../utils/base-response.dto';

export class SignInUserResponseDto
  extends BaseResponseDto<ISignInResponse>
  implements ISignInResponse
{
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
