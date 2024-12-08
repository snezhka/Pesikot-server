import { Expose } from "class-transformer";
import { ISignInResponse } from "src/utils/interfaces/auth";
import { BaseResponseDto } from "../../utils/base-response.dto";

export class SignInUserResponseDto extends BaseResponseDto<ISignInResponse> implements ISignInResponse {
    @Expose()
    accessToken: string;

    @Expose()
    refreshToken: string;
}