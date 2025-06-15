import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';  // abstract/interface
import { TwilioService } from './twilio.service';

const smsProviderFactory = {
  provide: SmsService,
  useFactory: (configService: ConfigService) => {
    const provider = configService.get<string>('SMS_PROVIDER');

    switch (provider) {
      case 'twilio':
        return new TwilioService();
      default:
        throw new Error(`Unsupported SMS provider: ${provider}`);
    }
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule],
  controllers: [SmsController],
  providers: [smsProviderFactory],
  exports: [SmsService],
})
export class SmsModule { }
