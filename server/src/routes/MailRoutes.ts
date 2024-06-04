import express from "express";
import { MailController } from "@src/controllers/MailController";

const router = express.Router();

router.get("/sync/:provider", MailController.syncMailbox);
router.post("/send/:provider", MailController.sendEmail);
router.get("/inbox/:mailboxId", MailController.getMailboxEmails);
router.get("/inbox", MailController.getAllMailboxDetails);

export default router;
