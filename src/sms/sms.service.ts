import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

const TWILIO_PHONE = '+1234567890'; // Replace with your Twilio number

@Injectable()
export class SmsService {
    private twilioClient: Twilio;
    constructor() {
        this.twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }

    async sendSms(phoneNumber: string) {

        // Send SMS
        try {
            const message = await this.twilioClient.messages.create({
                body: `Your login code is: ${this.generateCode()}`, // Or real code handling
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber,
            });
            console.log(`Message sent! SID: ${message}`);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }

    private generateCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    }

}

