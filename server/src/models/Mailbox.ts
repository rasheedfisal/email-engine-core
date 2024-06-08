export interface Mailbox {
  id: string;
  userId: string;
  emailAddress: string;
  displayName: string;
  mailboxType: string;
  status: Status;
  createdDateTime: string;
}

export interface Status {
  emailCount: number;
  lastSyncTime: string | null;
}
