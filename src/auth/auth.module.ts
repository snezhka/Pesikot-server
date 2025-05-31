import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from '../email/email.module';
import { SmsService } from 'src/sms/sms.service';
import { SmsModule } from 'src/sms/sms.module';

@Module({
    controllers: [AuthController],
    providers: [AuthService, {
        provide: APP_GUARD,
        useClass: AuthGuard,
    },],
    imports: [EmailModule, SmsModule, ConfigModule, UserModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_ACCESS_SECRET,
            signOptions: { expiresIn: '15min' },
        }),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_REFRESH_SECRET,
            signOptions: { expiresIn: '7d' },
        })]
    // imports: [UserModule,
    //     JwtModule.registerAsync({
    //         imports: [ConfigModule],
    //         useFactory: async (configService: ConfigService) => ({
    //             secret: configService.get('JWT_SECRET'),
    //             signOptions: { expiresIn: '60m' },  // Default expiration for JWT tokens
    //         }),
    //         inject: [ConfigService],
    //     }),
    //     ConfigModule.forRoot(),
    //     UserModule,  // Assuming user service is being used
    // ],
})
export class AuthModule { }