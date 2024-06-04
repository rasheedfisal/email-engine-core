import { atom, useAtom } from "jotai";
import { User } from "../types/response";
import { useEffect } from "react";
import { getProfile } from "../actions/user";

const userAtom = atom<User | undefined>(undefined);

export function useUser() {
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getProfile();
      setUser(userData.Data);
    };

    fetchUser();
  }, [setUser]);

  return user;
}
