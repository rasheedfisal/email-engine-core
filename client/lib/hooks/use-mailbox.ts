import { GetAllMailboxes } from "../actions/mail";

import { useQuery } from "@tanstack/react-query";

export const useMailbox = () => {
  return useQuery({
    queryKey: ["mailboxes"],
    queryFn: () => GetAllMailboxes(),
  });
};
