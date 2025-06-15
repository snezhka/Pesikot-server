import { IsNotEmpty, IsString } from 'class-validator';
import { IRefreshTokenRequest } from 'src/utils/interfaces/auth';

export class RefreshRequestDto implements IRefreshTokenRequest {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
