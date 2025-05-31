// src/email/email.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from 'src/utils/decorators';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) { }

    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post('send')
    async sendEmail(@Body() sendEmailDto: SendEmailDto) {
        const { to, subject, html } = sendEmailDto;
        console.log('Request received:', sendEmailDto);
        await this.emailService.sendEmail({ to, subject, html });
    }
}
