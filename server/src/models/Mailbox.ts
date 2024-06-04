export interface Mailbox {
  id: string;
  userId: string;
  emailAddress: string;
  displayName: string;
  mailboxType: string;
  status: Status;
}

export interface Status {
  emailCount: number;
  lastSyncTime: string | null;
}
