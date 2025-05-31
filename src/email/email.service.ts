// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import * as sendgrid from '@sendgrid/mail';
import { ISendEmail } from 'src/utils/interfaces/email';


@Injectable()
export class EmailService {
    constructor() {
        // Initialize SendGrid with API key (you can set this in environment variables)
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    }

    async sendEmail({ to, subject, html }: ISendEmail): Promise<void> {
        const msg = {
            to,  // recipient's email address
            from: process.env.SENDGRID_FROM_EMAIL, // your SendGrid verified email address
            subject,
            html,
        };

        try {
            await sendgrid.send(msg);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Email sending failed');
        }
    }
}
