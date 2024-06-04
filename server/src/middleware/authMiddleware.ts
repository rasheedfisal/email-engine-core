import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { sendMessage } from "@src/utils/sendMessage";
import { Request, Response, NextFunction } from "express";

export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    sendMessage(res, "Unauthorized", HttpStatusCodes.UNAUTHORIZED);
  }
}
