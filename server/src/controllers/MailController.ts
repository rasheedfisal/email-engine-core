import { Request, Response } from "express";
import { OutlookMailService } from "../services/OutlookMailService";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import logger from "jet-logger";
import { MailboxService } from "@src/services/MailboxService";
import { EmailService } from "@src/services/EmailService";
import { sendMessage } from "@src/utils/sendMessage";
import { EmailRepository } from "@src/repos/EmailRepo";

export class MailController {
  static async syncMailbox(req: Request, res: Response) {
    try {
      const user = req.user;

      if (!user) {
        return sendMessage(res, "Unauthorized", HttpStatusCodes.UNAUTHORIZED);
      }

      const provider = req.params.provider;

      let result;

      switch (provider) {
        case "outlook":
          result = await new OutlookMailService().syncMailbox(user);
          break;
        default:
          return sendMessage(
            res,
            "Unsupported provider",
            HttpStatusCodes.BAD_REQUEST
          );
      }

      if (!result) {
        return sendMessage(
          res,
          "Mailbox syncronization failed",
          HttpStatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      res.send("Mailbox sync complete");
    } catch (error) {
      logger.err(error);
      return sendMessage(
        res,
        "Error syncing mailbox",
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  static async sendEmail(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return sendMessage(res, "Unauthorized", HttpStatusCodes.UNAUTHORIZED);
      }

      const { provider } = req.params;
      const { recipient, subject, content } = req.body;

      switch (provider) {
        case "outlook":
          await new OutlookMailService().sendEmail(
            user,
            recipient,
            subject,
            content
          );
          break;
        default:
          return sendMessage(
            res,
            "Unsupported provider",
            HttpStatusCodes.BAD_REQUEST
          );
      }
      //await MailboxService.syncMailboxInternal(user, provider);

      sendMessage(res, "Email sent successfully", HttpStatusCodes.OK);
    } catch (error) {
      logger.err(error);
      return sendMessage(
        res,
        "Error sending email",
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  static async getAllMailboxDetails(req: Request, res: Response) {
    try {
      const result = await MailboxService.getAllUserMailboxDetails(
        req.user?.id!
      );
      if (result === null) {
        return sendMessage(res, "Mailbox not found", HttpStatusCodes.NOT_FOUND);
      }

      sendMessage(res, "Mailboxes retrived", HttpStatusCodes.OK, result);
    } catch (error) {
      logger.err(error);
      sendMessage(
        res,
        "Error getting mailbox details",
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  static async getMailboxEmails(req: Request, res: Response) {
    try {
      const { mailboxId } = req.params;

      const result = await EmailService.getMailboxEmails(mailboxId);

      if (result === null) {
        return sendMessage(res, "Emails not found", HttpStatusCodes.NOT_FOUND);
      }

      sendMessage(res, "Mailboxes retrived", HttpStatusCodes.OK, result);
    } catch (error) {
      logger.err(error);
      sendMessage(
        res,
        "Error getting mailbox emails",
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
