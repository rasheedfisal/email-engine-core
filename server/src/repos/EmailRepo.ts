import { Email } from "@src/models/Email";
import elasticSearchClient from "./elasticSearchClient";
import logger from "jet-logger";
export class EmailRepository {
  // create Emails
  static async createEmail(email: Email) {
    try {
      const emailExists = await elasticSearchClient.search({
        index: "emails",
        body: {
          query: {
            bool: {
              must: [{ match: { id: email.id } }],
            },
          },
        },
      });
      if (emailExists.hits.hits.length === 0) {
        await elasticSearchClient.index({
          index: "emails",
          body: {
            id: email.id,
            mailboxId: email.mailboxId,
            subject: email.subject,
            sender: email.sender,
            recipients: email.recipients,
            body: email.body,
            bodyPreview: email.bodyPreview,
            isRead: email.isRead,
            isDraft: email.isDraft,
            importance: email.importance,
            createdDateTime: email.createdDateTime,
            sentDateTime: email.sentDateTime,
            receivedDateTime: email.receivedDateTime,
          },
        });
        logger.info("email details saved to Elasticsearch");
        logger.info("create email in Elasticsearch");
      }
    } catch (error) {
      logger.err(error);
    }
  }

  static async getEmailsByMailboxId(mailboxId: string) {
    try {
      const { hits } = await elasticSearchClient.search({
        index: "emails",
        body: {
          query: {
            match: {
              mailboxId,
            },
          },
        },
      });

      if (hits.hits.length === 0) {
        return null;
      }
      const emails = hits.hits.map((hit) => hit._source as Email);
      logger.info(
        `Retrieved ${emails.length} emails for mailboxId: ${mailboxId}`
      );
      return emails;
    } catch (error) {
      logger.err("Error retrieving emails by mailboxId:" + error);
      //throw error;
      return null;
    }
  }
}
