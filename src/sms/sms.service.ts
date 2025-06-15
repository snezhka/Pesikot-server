import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private twilioClient: Twilio;

  constructor() {
    this.twilioClient = new Twilio(
      process.env.SMS_PROVIDER_ACCOUNT_SID,
      process.env.SMS_PROVIDER_AUTH_TOKEN,
    );
  }

  async sendSms(phoneNumber: string) {
    try {
      const code = this.generateCode();
      const message = await this.twilioClient.messages.create({
        body: `Your login code is: ${code}`, // Or real code handling
        from: process.env.SMS_PROVIDER_PHONE_NUMBER,
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
