import { Email, Mailbox } from "../types/response";
import { Providers, Response } from "../types/general";
import { privateApi } from "./axios";

export const GetAllMailboxes = async () => {
  const res = await privateApi.get<Response<Mailbox[]>>("/mail/inbox");
  return res.data;
};

export const GetAllEmailboxes = async (mailboxId: string) => {
  const res = await privateApi.get<Response<Email[]>>(
    `/mail/inbox/${mailboxId}`
  );
  return res.data;
};

export const syncMailbox = async (provider: Providers) => {
  const res = await privateApi.get<Response<null>>(`/mail/sync/${provider}`);
  return res.data;
};

export const sendEmail = async ({
  recipient,
  subject,
  content,
  provider,
}: {
  recipient: string;
  subject: string;
  content: string;
  provider: string;
}) => {
  const res = await privateApi.post<Response<null>>(`/mail/send/${provider}`, {
    recipient,
    subject,
    content,
  });
  return res.data;
};
