import { IsNotEmpty, IsString } from 'class-validator';
import { BaseResponseDto } from 'src/utils/base-response.dto';
import { IAccesTokenResponse } from 'src/utils/interfaces/auth';

export class AccessResponseDto
  extends BaseResponseDto<IAccesTokenResponse>
  implements IAccesTokenResponse
{
  @IsNotEmpty()
  @IsString()
  accessToken!: string;
}
