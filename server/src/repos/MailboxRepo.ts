import { Mailbox } from "@src/models/Mailbox";
import elasticSearchClient from "./elasticSearchClient";
import logger from "jet-logger";
export class MailboxRepository {
  // Function to save mailbox details to Elasticsearch
  static async saveOrUpdateMailboxDetails(
    userId: string,
    emailAddress: string,
    displayName: string,
    mailboxType: string
  ) {
    try {
      const mailboxExists = await elasticSearchClient.search({
        index: "mailboxes",
        body: {
          query: {
            bool: {
              must: [
                { match: { userId } },
                // { match: { emailAddress } },
                { match: { mailboxType } },
              ],
            },
          },
        },
      });

      if (mailboxExists.hits.hits.length > 0) {
        await elasticSearchClient.updateByQuery({
          index: "mailboxes",
          body: {
            query: {
              bool: {
                must: [
                  { match: { userId } },
                  // { match: { emailAddress } },
                  { match: { mailboxType } },
                ],
              },
            },
            script: {
              source: `
                        ctx._source.displayName = params.displayName;
                        ctx._source.status.lastSyncTime = params.lastSyncTime;
                        `,
              params: { displayName, lastSyncTime: new Date().toISOString() },
            },
          },
        });
        logger.info("Mailbox details updated in Elasticsearch");
      } else {
        await elasticSearchClient.index({
          index: "mailboxes",
          body: {
            userId,
            emailAddress,
            displayName,
            mailboxType,
            status: {
              emailCount: 0,
              lastSyncTime: new Date().toISOString(),
            },
          },
        });
        logger.info("Mailbox details saved to Elasticsearch");
      }
    } catch (error) {
      logger.err(
        "Error saving or updating mailbox details in Elasticsearch:",
        error
      );
    }
  }

  // Function to update mailbox status
  static async updateMailboxStatus(id: string, emailCount: number) {
    console.log("emailCount", emailCount);

    try {
      await elasticSearchClient.update({
        index: "mailboxes",
        id: id,
        body: {
          doc: {
            status: {
              emailCount: emailCount,
              lastSyncTime: new Date().toISOString(),
            },
          },
        },
      });
      logger.info("Mailbox status updated");
    } catch (error) {
      logger.err("Error updating mailbox status:", error);
    }
  }

  // Function to retrieve mailbox details from Elasticsearch based on userId
  static async getMailboxDetailsFromDatabase(
    userId: string,
    mailboxType: string
  ) {
    try {
      const { hits } = await elasticSearchClient.search({
        index: "mailboxes",
        body: {
          query: {
            bool: {
              must: [
                { match: { userId: userId } },
                { match: { mailboxType: mailboxType } },
              ],
            },
          },
        },
      });
      if (hits.hits.length > 0) {
        logger.info("Mailbox details retrieved from Elasticsearch");
        const id = hits.hits[0]._id;
        const restObj = hits.hits[0]._source as Mailbox;
        const result: Mailbox = {
          ...restObj,
          id,
        };
        return result;
      } else {
        logger.err("Mailbox details not found in Elasticsearch");
        return null;
      }
    } catch (error) {
      logger.err("Error retrieving mailbox details from Elasticsearch:", error);
      return null;
    }
  }

  static async getAllMailboxDetailsFromDatabase(userId: string) {
    try {
      const { hits } = await elasticSearchClient.search({
        index: "mailboxes",
        body: {
          query: {
            bool: {
              must: [{ match: { userId: userId } }],
            },
          },
        },
      });
      if (hits.hits.length > 0) {
        logger.info("Mailbox details retrieved from Elasticsearch");

        const results = hits.hits.map(
          (x) => ({ ...(x._source as Mailbox), id: x._id } as Mailbox)
        );

        return results;
      } else {
        logger.err("Mailbox details not found in Elasticsearch");
        return null;
      }
    } catch (error) {
      logger.err("Error retrieving mailbox details from Elasticsearch:", error);
      return null;
    }
  }
}
