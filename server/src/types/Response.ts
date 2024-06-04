export enum StatusType {
  Success = "Success",
  Error = "Error",
}

export type Response<T> = {
  Status: StatusType;
  StatusCode: number;
  Message: string;
  Data: T | null;
};
