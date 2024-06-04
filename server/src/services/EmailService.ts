import { EmailRepository } from "../repos/EmailRepo";

export class EmailService {
  static async getMailboxEmails(mailboxId: string) {
    return await EmailRepository.getEmailsByMailboxId(mailboxId);
  }
}
