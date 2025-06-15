import { ISendEmail } from "src/utils/interfaces/email";

export abstract class EmailService {
  abstract sendEmail(sendEmailData: ISendEmail): Promise<void>;
}
