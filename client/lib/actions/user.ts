import { User } from "../types/response";
import { privateApi, publicApi } from "./axios";
import { Response } from "../types/general";

export const getProfile = async () => {
  const res = await privateApi.get<Response<User>>("/user/profile");
  return res.data;
};
export const logout = async () => {
  await publicApi.post("/auth/logout");
};
