export interface OAuthProvider {
  id: string;
  token: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  providers: {
    [key: string]: OAuthProvider;
  };
}
