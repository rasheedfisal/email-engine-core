export interface MailProviderStrategy {
  syncMailbox(user: Express.User): Promise<any>;
  sendEmail(
    user: Express.User,
    recipient: string,
    subject: string,
    body: string
  ): Promise<void>;
}
