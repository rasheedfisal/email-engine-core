export enum Providers {
  OUTLOOK = "outlook",
}

export type Response<T> = {
  Status: string;
  StatusCode: number;
  Message: string;
  Data?: T;
};
