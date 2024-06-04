import { atom, useAtom } from "jotai";
import { Email } from "../types/response";
import { useEffect } from "react";
import { GetAllEmailboxes } from "../actions/mail";

const emailAtom = atom<Email[] | undefined>(undefined);

export function useEmail(mailboxId: string) {
  const [email, setEmail] = useAtom(emailAtom);

  useEffect(() => {
    const fetchMailbox = async () => {
      const email = await GetAllEmailboxes(mailboxId);

      setEmail(email.Data);
    };

    fetchMailbox();
  }, [mailboxId, setEmail]);

  return email;
}
