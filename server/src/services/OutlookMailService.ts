import { Client } from "@microsoft/microsoft-graph-client";
import { MailProviderStrategy } from "../abstractions/MailProviderStrategy";
import { MailboxRepository } from "@src/repos/MailboxRepo";
import { Email } from "@src/models/Email";
import { EmailRepository } from "@src/repos/EmailRepo";
import logger from "jet-logger";
import { MailboxType } from "../types/OutlookTypes";
import { MailboxService } from "./MailboxService";

export class OutlookMailService implements MailProviderStrategy {
  async fetchMessages(token: string, folder: MailboxType, filter?: string) {
    const client = Client.init({
      authProvider: (done) => {
        done(null, token);
      },
    });
    let allMessages: any = [];
    let apiPath = `/me/mailFolders/${folder}/messages`;

    if (filter) {
      apiPath += `?$filter=${encodeURIComponent(filter)}`;
    }
    let mails = await client.api(apiPath).get();
    while (mails) {
      allMessages = allMessages.concat(mails.value);

      if (mails["@odata.nextLink"]) {
        mails = await client.api(mails["@odata.nextLink"]).get();
      } else {
        break;
      }
    }
    // const mails = await client.api(apiPath).top(10).get();
    return allMessages;
  }

  async saveEmails(emails: any[], mailboxId?: string) {
    if (!mailboxId || emails.length === 0) {
      return; // If mailboxId is null or emails array is empty, do nothing
    }
    const emailPromises = emails.map(async (em: any) => {
      const emailObj: Email = {
        id: em.id,
        mailboxId,
        subject: em.subject,
        sender: em?.from?.emailAddress?.address || "N/A",
        recipients: em?.toRecipients
          ? em?.toRecipients
              .map((x: any) => x?.emailAddress?.address)
              .toString()
          : "N/A",
        body: em.body.content,
        bodyPreview: em.bodyPreview,
        isRead: em.isRead,
        isDraft: em.isDraft,
        importance: em.importance,
        createdDateTime: em.createdDateTime,
        sentDateTime: em.sentDateTime,
        receivedDateTime: em.receivedDateTime,
      };

      await EmailRepository.createEmail(emailObj);
    });
    await Promise.all(emailPromises);
    await MailboxRepository.updateMailboxStatus(mailboxId, emails.length);
  }

  async syncMailbox(user: Express.User) {
    try {
      const token = user.providers.outlook.token as string;

      const userId = user.id;
      const username = user.username;
      const emailAddress = user.email;

      console.log("inbox enum", MailboxType.INBOX);

      const fetchInbox = this.fetchMessages(token, MailboxType.INBOX);

      // const fetchUnread = this.fetchMessages(token, "inbox", "isRead eq false");
      const fetchSent = this.fetchMessages(token, MailboxType.SENT);
      // const fetchImportant = this.fetchMessages(
      //   token,
      //   "inbox",
      //   "importance eq 'high'"
      // );
      const fetchDraft = this.fetchMessages(token, MailboxType.DRAFT);
      const fetchTrash = this.fetchMessages(token, MailboxType.TRASH);
      const fetchSpam = this.fetchMessages(token, MailboxType.SPAM);
      const fetchArchive = this.fetchMessages(token, MailboxType.ARCHIVE);

      console.log("==> start retriving...");

      const [
        inboxEmails,
        sentEmails,
        draftEmails,
        trashEmails,
        spamEmails,
        archiveEmails,
      ] = await Promise.all([
        fetchInbox,
        fetchSent,
        fetchDraft,
        fetchTrash,
        fetchSpam,
        fetchArchive,
      ]);

      console.log("==> end retriving...");

      await Promise.all([
        MailboxRepository.saveOrUpdateMailboxDetails(
          userId,
          emailAddress,
          username,
          MailboxType.INBOX
        ),
        MailboxRepository.saveOrUpdateMailboxDetails(
          userId,
          emailAddress,
          username,
          MailboxType.SENT
        ),
        MailboxRepository.saveOrUpdateMailboxDetails(
          userId,
          emailAddress,
          username,
          MailboxType.DRAFT
        ),
        MailboxRepository.saveOrUpdateMailboxDetails(
          userId,
          emailAddress,
          username,
          MailboxType.TRASH
        ),
        MailboxRepository.saveOrUpdateMailboxDetails(
          userId,
          emailAddress,
          username,
          MailboxType.SPAM
        ),
        MailboxRepository.saveOrUpdateMailboxDetails(
          userId,
          emailAddress,
          username,
          MailboxType.ARCHIVE
        ),
      ]);
      // Process and save emails to the database (Elasticsearch)

      const [inboxMail, sentMail, draftMail, trashMail, spamMail, archiveMail] =
        await Promise.all([
          MailboxRepository.getMailboxDetailsFromDatabase(
            userId,
            MailboxType.INBOX
          ),
          MailboxRepository.getMailboxDetailsFromDatabase(
            userId,
            MailboxType.SENT
          ),
          MailboxRepository.getMailboxDetailsFromDatabase(
            userId,
            MailboxType.DRAFT
          ),
          MailboxRepository.getMailboxDetailsFromDatabase(
            userId,
            MailboxType.TRASH
          ),
          MailboxRepository.getMailboxDetailsFromDatabase(
            userId,
            MailboxType.SPAM
          ),
          MailboxRepository.getMailboxDetailsFromDatabase(
            userId,
            MailboxType.ARCHIVE
          ),
        ]);

      if (inboxEmails.length > 0) {
        await this.saveEmails(inboxEmails, inboxMail?.id);
      }

      console.log("==> inbox check");

      if (sentEmails.length > 0) {
        await this.saveEmails(sentEmails, sentMail?.id);
      }

      console.log("==> sent check");

      if (draftEmails.length > 0) {
        await this.saveEmails(draftEmails, draftMail?.id);
      }

      console.log("==> draft check");

      if (trashEmails.length > 0) {
        await this.saveEmails(trashEmails, trashMail?.id);
      }

      console.log("==> trash check");

      if (spamEmails.length > 0) {
        await this.saveEmails(spamEmails, spamMail?.id);
      }

      console.log("==> spam check");

      if (archiveEmails.length > 0) {
        await this.saveEmails(archiveEmails, archiveMail?.id);
      }

      console.log("==> archive check");

      return true;
    } catch (error) {
      logger.err(error);
      return false;
    }
  }

  async sendEmail(
    user: Express.User,
    recipient: string,
    subject: string,
    body: string
  ) {
    const client = Client.init({
      authProvider: (done) => {
        done(null, user.providers.outlook.token);
      },
    });

    const mail = {
      message: {
        subject: subject,
        body: {
          contentType: "HTML",
          content: body,
        },
        toRecipients: [
          {
            emailAddress: {
              address: recipient,
            },
          },
        ],
      },
      saveToSentItems: "true",
    };

    await client
      .api("/me/sendMail")
      .post({ message: mail.message, saveToSentItems: true });

    await MailboxService.syncMailboxInternal(user, "outlook");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
