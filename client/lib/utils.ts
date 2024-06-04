import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import {
  Archive,
  ArchiveX,
  File,
  Inbox,
  Send,
  Trash2,
  LucideIcon,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateInitials(username: string): string {
  // Split the username into words based on spaces and filter out any empty strings
  const words = username
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  // Extract the first letter of each word, convert it to uppercase, and join them together
  const initials = words.map((word) => word[0].toUpperCase()).join("");

  return initials;
}

export enum MailboxType {
  INBOX = "inbox",
  SENT = "sentitems",
  DRAFT = "drafts",
  TRASH = "deletedItems",
  SPAM = "junkEmail",
  ARCHIVE = "archive",
}

export function getMailboxName(mailbox: string): string {
  let mailboxName = "";

  if (mailbox === "inbox") mailboxName = "Inbox";
  if (mailbox === "sentitems") mailboxName = "Sent";
  if (mailbox === "drafts") mailboxName = "Drafts";
  if (mailbox === "deletedItems") mailboxName = "Trash";
  if (mailbox === "junkEmail") mailboxName = "Spam";
  if (mailbox === "archive") mailboxName = "Archive";

  return mailboxName;
}

export function getMailboxIcon(mailbox: string): LucideIcon {
  let mailboxName = Inbox;

  if (mailbox === "inbox") mailboxName = Inbox;
  if (mailbox === "sentitems") mailboxName = Send;
  if (mailbox === "drafts") mailboxName = File;
  if (mailbox === "deletedItems") mailboxName = Trash2;
  if (mailbox === "junkEmail") mailboxName = Archive;
  if (mailbox === "archive") mailboxName = ArchiveX;

  return mailboxName;
}
