export interface Email {
  id: string;
  mailboxId: string;
  subject: string;
  sender: string;
  recipients: string;
  body: string;
  bodyPreview: string;
  isRead: boolean;
  isDraft: boolean;
  importance: string;
  createdDateTime: string;
  sentDateTime: string | null;
  receivedDateTime: string | null;
}
