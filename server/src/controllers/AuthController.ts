import EnvVars from "@src/constants/EnvVars";
import { Request, Response } from "express";
import { MailController } from "./MailController";
import { MailboxService } from "@src/services/MailboxService";

export class AuthController {
  static async handleOAuthCallback(
    req: Request,
    res: Response,
    provider: string
  ) {
    if (req.isAuthenticated()) {
      await MailboxService.syncMailboxInternal(req.user!, provider);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await MailboxService.syncMailboxInternal(req.user!, provider);
      res.redirect(EnvVars.Fronend.base + EnvVars.Fronend.home);
    } else {
      res.redirect(EnvVars.Fronend.base);
    }
  }
}
