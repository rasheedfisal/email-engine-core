import { Request, Response } from "express";
import { User } from "../models/users";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { sendMessage } from "@src/utils/sendMessage";

export class UserController {
  static async getUserProfile(req: Request, res: Response) {
    sendMessage(res, "User data retrived", HttpStatusCodes.OK, req.user);
  }
}
