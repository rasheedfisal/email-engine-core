// import { atom, useAtom } from "jotai";
// import { Mailbox } from "../types/response";
// import { useEffect } from "react";
import { GetAllMailboxes } from "../actions/mail";

import { useQuery } from "@tanstack/react-query";

// const mailboxAtom = atom<Mailbox[] | undefined>(undefined);

// export function useMailbox() {
//   const [mailbox, setMailbox] = useAtom(mailboxAtom);

//   useEffect(() => {
//     const fetchMailbox = async () => {
//       const mailbox = await GetAllMailboxes();
//       setMailbox(mailbox.Data);
//     };

//     fetchMailbox();
//   }, [setMailbox]);

//   return mailbox;
// }

export const useMailbox = () => {
  return useQuery({
    queryKey: ["mailboxes"],
    queryFn: () => GetAllMailboxes(),
  });
};
