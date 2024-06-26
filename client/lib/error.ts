import axios from "axios";

export class HttpError extends Error {
  constructor(message?: string) {
    super(message); // 'Error' breaks prototype chain here
    this.name = "HttpError";
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

export async function httpErrorHandler(error: any) {
  if (error === null) throw new Error("Unrecoverable error!! Error is null!");
  if (axios.isAxiosError(error)) {
    //here we have a type guard check, error inside this if will be treated as AxiosError
    const response = error?.response;
    const request = error?.request;
    const originalRequest = error?.config; //here we have access the config used to make the api call (we can make a retry using this conf)

    if (error.code === "ERR_NETWORK") {
      throw new Error("connection problems..");
    } else if (error.code === "ERR_CANCELED") {
      throw new Error("connection canceled..");
    }

    if (response && originalRequest !== undefined) {
      //The request was made and the server responded with a status code that falls out of the range of 2xx the http status code mentioned above
      const statusCode = response?.status;

      if (statusCode === 403) {
        document.location.href = "/login";
      }

      if (statusCode >= 400) {
        //return response;
        throw new HttpError(response.data.Message);
      }
    } else if (request) {
      throw new HttpError("Server error");
      //The request was made but no response was received, `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in Node.js
    }
  }
  //Something happened in setting up the request and triggered an Error
  console.log(error.message);
}
