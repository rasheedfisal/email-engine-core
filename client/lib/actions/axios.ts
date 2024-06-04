import axios, { AxiosResponse } from "axios";
import { env } from "../env.client";
import { HttpError, httpErrorHandler } from "../error";

export const publicApi = axios.create({
  baseURL: env.API_BASE_ROUTE + "/api",
});

publicApi.defaults.headers.common["Content-Type"] = "application/json";

export const privateApi = axios.create({
  baseURL: env.API_BASE_ROUTE + "/api",
  withCredentials: true,
});

privateApi.defaults.headers.common["Content-Type"] = "application/json";

declare module "axios" {
  export interface AxiosRequestConfig {
    raw?: boolean;
  }
  export interface AxiosResponse {
    error?: string;
  }
}

///////// Intercepters ///////

function responseHandler<T>(response: AxiosResponse<T>) {
  if (response.status == 200 || response.status == 201) {
    const data = response?.data;
    if (!data) {
      throw new HttpError("No data!");
    }
    return response;
  }
  throw new HttpError("Invalid status code!");
}

async function responseErrorHandler(error: any) {
  const originalRequest = error?.config;

  if (originalRequest.raw) {
    return error;
  }
  // the code of this function was written in above section.
  return await httpErrorHandler(error);
}

//register interceptor like this
publicApi.interceptors.response.use(responseHandler, responseErrorHandler);
privateApi.interceptors.response.use(responseHandler, responseErrorHandler);
