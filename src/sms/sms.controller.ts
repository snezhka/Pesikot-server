import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from 'src/utils/decorators';
import { SmsService } from './sms.service';

@Controller('sms')
export class SmsController {
    constructor(private readonly smsService: SmsService) { }

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('send')
    async loginWithSms(@Body('phoneNumber') phoneNumber: string) {
        return this.smsService.sendSms(phoneNumber);
    }
}
