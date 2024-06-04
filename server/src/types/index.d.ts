import { User } from "@src/models/user";

// **** Declaration Merging **** //

declare global {
  namespace Express {
    export interface User {
      id: string;
      username: string;
      email: string;
      providers: {
        [key: string]: OAuthProvider;
      };
    }
    export interface Request {
      user?: User;
      signedCookies: Record<string, string>;
      isAuthenticated(): boolean;
      logout(): void;
    }
  }
}
