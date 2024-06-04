import { GetAllEmailboxes } from "../actions/mail";

import { useQuery } from "@tanstack/react-query";

export const useEmail = (mailboxId: string) => {
  return useQuery({
    queryKey: ["email" + mailboxId],
    queryFn: () => GetAllEmailboxes(mailboxId),
  });
};
