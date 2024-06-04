// import { atom, useAtom } from "jotai";
// import { Email } from "../types/response";
// import { useEffect } from "react";
import { GetAllEmailboxes } from "../actions/mail";

import { useQuery } from "@tanstack/react-query";

// const emailAtom = atom<Email[] | undefined>(undefined);

// export function useEmail(mailboxId: string) {
//   const [email, setEmail] = useAtom(emailAtom);

//   useEffect(() => {
//     const fetchMailbox = async () => {
//       const email = await GetAllEmailboxes(mailboxId);

//       setEmail(email.Data);
//     };

//     fetchMailbox();
//   }, [mailboxId, setEmail]);

//   return email;
// }

export const useEmail = (mailboxId: string) => {
  return useQuery({
    queryKey: ["email" + mailboxId],
    queryFn: () => GetAllEmailboxes(mailboxId),
  });
};
