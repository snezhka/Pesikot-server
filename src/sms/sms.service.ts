export abstract class SmsService {
    protected smsClient;
    abstract sendSms(phoneNumber: string): Promise<string>;
}
