import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { SmsService } from './sms.service';

@Injectable()
export class TwilioService extends SmsService {
  private twilioClient: Twilio;

  constructor() {
    super()
    this.smsClient = new Twilio(
      process.env.TWILIO_PROVIDER_ACCOUNT_SID,
      process.env.TWILIO_PROVIDER_AUTH_TOKEN,
    );
  }

  async sendSms(phoneNumber: string): Promise<string> {
    try {
      const code = this.generateCode();
      const message = await this.twilioClient.messages.create({
        body: `Your login code is: ${code}`, // Or real code handling
        from: process.env.TWILIO_PROVIDER_PHONE_NUMBER,
        to: phoneNumber,
      });
      console.log(`Message sent! SID:  ${message.sid.toString()}`);
      return code;
    } catch (error) {
      console.error(
        'Failed to send message:',
        error instanceof Error ? error.message : error,
      );
    }
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  }
}
