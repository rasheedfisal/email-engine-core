export type Email = {
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
};

export type OAuthProvider = {
  id: string;
  token: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  providers: {
    [key: string]: OAuthProvider;
  };
};

export type Mailbox = {
  id: string;
  userId: string;
  emailAddress: string;
  displayName: string;
  mailboxType: string;
  status: Status;
};

export type Status = {
  emailCount: number;
  lastSyncTime: string | null;
};
