import { Client } from "@microsoft/microsoft-graph-client";
import { MailProviderStrategy } from "../abstractions/MailProviderStrategy";
import { MailboxRepository } from "@src/repos/MailboxRepo";
import { Email } from "@src/models/Email";
import { EmailRepository } from "@src/repos/EmailRepo";
import logger from "jet-logger";
import { MailboxType } from "../types/OutlookTypes";
import { MailboxService } from "./MailboxService";

//M.C534_BAY.2.U.9b992022-9cab-d34d-9ea7-57e12388039e

export class OutlookMailService implements MailProviderStrategy {
  async fetchMessages(token: string, folder: MailboxType, filter?: string) {
    const client = Client.init({
      authProvider: (done) => {
        done(null, token);
      },
    });
    let apiPath = `/me/mailFolders/${folder}/messages`;

    if (filter) {
      apiPath += `?$filter=${encodeURIComponent(filter)}`;
    }
    const mails = await client.api(apiPath).get();
    // const mails = await client.api(apiPath).top(10).get();
    return mails.value;
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

      const inboxMail = MailboxRepository.saveOrUpdateMailboxDetails(
        userId,
        emailAddress,
        username,
        MailboxType.INBOX
      );

      const sentMail = MailboxRepository.saveOrUpdateMailboxDetails(
        userId,
        emailAddress,
        username,
        MailboxType.SENT
      );

      const draftMail = MailboxRepository.saveOrUpdateMailboxDetails(
        userId,
        emailAddress,
        username,
        MailboxType.DRAFT
      );

      const trashMail = MailboxRepository.saveOrUpdateMailboxDetails(
        userId,
        emailAddress,
        username,
        MailboxType.TRASH
      );
      const spamMail = MailboxRepository.saveOrUpdateMailboxDetails(
        userId,
        emailAddress,
        username,
        MailboxType.SPAM
      );
      const archiveMail = MailboxRepository.saveOrUpdateMailboxDetails(
        userId,
        emailAddress,
        username,
        MailboxType.ARCHIVE
      );

      await Promise.all([
        inboxMail,
        sentMail,
        draftMail,
        trashMail,
        spamMail,
        archiveMail,
      ]);

      // Process and save emails to the database (Elasticsearch)

      if (inboxEmails.length > 0) {
        const mailInboxInfo =
          await MailboxRepository.getMailboxDetailsFromDatabase(
            userId,
            MailboxType.INBOX
          );

        if (!!mailInboxInfo) {
          inboxEmails.forEach(async (em: any) => {
            let emailObj: Email = {
              id: em.id,
              mailboxId: mailInboxInfo.id,
              subject: em.subject,
              sender: em.from.emailAddress.address,
              recipients: em.toRecipients
                .map((x: any) => x.emailAddress.address)
                .toString(),
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
          await MailboxRepository.updateMailboxStatus(
            mailInboxInfo.id,
            inboxEmails.length
          );
        }
      }

      console.log("==> inbox check");

      if (sentEmails.length > 0) {
        const sentInboxInfo =
          await MailboxRepository.getMailboxDetailsFromDatabase(
            userId,
            MailboxType.SENT
          );
        if (!!sentInboxInfo) {
          sentEmails.forEach(async (em: any) => {
            let emailObj: Email = {
              id: em.id,
              mailboxId: sentInboxInfo.id,
              subject: em.subject,
              sender: em.from.emailAddress.address,
              recipients: em.toRecipients
                .map((x: any) => x.emailAddress.address)
                .toString(),
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

          await MailboxRepository.updateMailboxStatus(
            sentInboxInfo.id,
            sentEmails.length
          );
        }
      }

      console.log("==> sent check");

      if (draftEmails.length > 0) {
        const draftInboxInfo =
          await MailboxRepository.getMailboxDetailsFromDatabase(
            userId,
            MailboxType.DRAFT
          );
        if (!!draftInboxInfo) {
          draftEmails.forEach(async (em: any) => {
            let emailObj: Email = {
              id: em.id,
              mailboxId: draftInboxInfo.id,
              subject: em.subject,
              sender: em.from.emailAddress.address,
              recipients: em.toRecipients
                .map((x: any) => x.emailAddress.address)
                .toString(),
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

          await MailboxRepository.updateMailboxStatus(
            draftInboxInfo.id,
            draftEmails.length
          );
        }
      }

      console.log("==> draft check");

      if (trashEmails.length > 0) {
        const trashInboxInfo =
          await MailboxRepository.getMailboxDetailsFromDatabase(
            userId,
            MailboxType.TRASH
          );
        if (!!trashInboxInfo) {
          trashEmails.forEach(async (em: any) => {
            let emailObj: Email = {
              id: em.id,
              mailboxId: trashInboxInfo.id,
              subject: em.subject,
              sender: em.from.emailAddress.address,
              recipients: em.toRecipients
                .map((x: any) => x.emailAddress.address)
                .toString(),
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

          await MailboxRepository.updateMailboxStatus(
            trashInboxInfo.id,
            trashEmails.length
          );
        }
      }

      console.log("==> trash check");

      if (spamEmails.length > 0) {
        const spamInboxInfo =
          await MailboxRepository.getMailboxDetailsFromDatabase(
            userId,
            MailboxType.SPAM
          );
        if (!!spamInboxInfo) {
          spamEmails.forEach(async (em: any) => {
            let emailObj: Email = {
              id: em.id,
              mailboxId: spamInboxInfo.id,
              subject: em.subject,
              sender: em.from.emailAddress.address,
              recipients: em.toRecipients
                .map((x: any) => x.emailAddress.address)
                .toString(),
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

          await MailboxRepository.updateMailboxStatus(
            spamInboxInfo.id,
            spamEmails.length
          );
        }
      }

      console.log("==> spam check");

      if (archiveEmails.length > 0) {
        const archiveInboxInfo =
          await MailboxRepository.getMailboxDetailsFromDatabase(
            userId,
            MailboxType.ARCHIVE
          );
        if (!!archiveInboxInfo) {
          archiveEmails.forEach(async (em: any) => {
            let emailObj: Email = {
              id: em.id,
              mailboxId: archiveInboxInfo.id,
              subject: em.subject,
              sender: em.from.emailAddress.address,
              recipients: em.toRecipients
                .map((x: any) => x.emailAddress.address)
                .toString(),
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

          await MailboxRepository.updateMailboxStatus(
            archiveInboxInfo.id,
            archiveEmails.length
          );
        }
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
  }
}
