import { MailboxRepository } from "../repos/MailboxRepo";
import { OutlookMailService } from "./OutlookMailService";
export class MailboxService {
  static async getAllUserMailboxDetails(userId: string) {
    return await MailboxRepository.getAllMailboxDetailsFromDatabase(userId);
  }

  static async syncMailboxInternal(user: Express.User, provider: string) {
    let result;
    switch (provider) {
      case "outlook":
        result = await new OutlookMailService().syncMailbox(user);
        break;
      default:
        result = null;
    }

    if (!result) {
      return false;
    }

    return true;
  }
}
