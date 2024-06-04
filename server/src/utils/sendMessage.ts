import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import { Response, StatusType } from "@src/types/Response";

import { Response as RouteResponse } from "express";

export function sendMessage<T>(
  res: RouteResponse,
  message: string,
  statusCode: HttpStatusCodes,
  data: T | null = null,
  status: StatusType | null = null
) {
  let newStatus = StatusType.Success;
  let newData = data;
  if (!status) {
    newStatus = statusCode >= 400 ? StatusType.Error : StatusType.Success;
  }

  if (!data) {
    newData = null;
  }

  const result: Response<T> = {
    Status: newStatus,
    StatusCode: statusCode,
    Message: message,
    Data: newData,
  };

  res.status(statusCode).json(result);
}
