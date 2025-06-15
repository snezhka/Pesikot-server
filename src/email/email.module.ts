// src/email/email.module.ts
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SendGridService } from './sendGrid.service';

const emailProviderFactory = {
  provide: EmailService,
  useFactory: (configService: ConfigService) => {
    const provider = configService.get<string>('EMAIL_PROVIDER');

    switch (provider) {
      case 'send_grid':
        return new SendGridService();
      default:
        throw new Error(`Unsupported Email provider: ${provider}`);
    }
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule],
  controllers: [EmailController],
  providers: [emailProviderFactory],
  exports: [EmailService],
})
export class EmailModule { }
