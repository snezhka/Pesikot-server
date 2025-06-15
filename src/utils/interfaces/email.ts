export interface ISendEmail {
  to: string; // The recipient's email
  subject: string; // The subject of the email
  html?: string; // The HTML content (optional)
}
