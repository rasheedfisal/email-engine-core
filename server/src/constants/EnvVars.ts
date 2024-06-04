import config from "config";
import { Strategy as OutlookStrategy } from "passport-microsoft";

/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */

export default {
  NodeEnv: config.get<string>("node_env") ?? "",
  Port: config.get<number>("port") ?? 0,
  CookieProps: {
    Key: "ExpressGeneratorTs",
    Secret: config.get<string>("cookie_secret") ?? "",
    // Casing to match express cookie options
    Options: {
      httpOnly: config.get<boolean>("http_only") ?? false,
      signed: config.get<boolean>("signed") ?? false,
      path: config.get<string>("cookie_path") ?? "",
      maxAge: config.get<number>("cookie_exp") ?? 0,
      domain: config.get<string>("cookie_domain") ?? "",
      secure: config.get<boolean>("secure_cookie") ?? false,
    },
  },
  Jwt: {
    Secret: config.get<string>("jwt_secret") ?? "",
    Exp: config.get<number>("cookie_exp") ?? 0, // exp at the same time as the cookie
  },
  providers: [
    {
      name: "outlook",
      clientId: process.env.OUTLOOK_CLIENT_ID ?? "",
      clientSecret: process.env.OUTLOOK_CLIENT_SECRET ?? "",
      callbackURL: process.env.OUTLOOK_CALLBACKURL ?? "",
      strategy: OutlookStrategy,
      scope: [
        "openid",
        "profile",
        "email",
        "User.Read",
        "Mail.Read",
        "Mail.ReadWrite",
        "Mail.Send",
      ],
    },
  ],
  ElasticSearch: {
    node: process.env.ELASTIC_SEARCH_NODE ?? "",
    username: process.env.ELASTIC_SEARCH_USERNAME ?? "",
    password: process.env.ELASTIC_SEARCH_PASSWORD ?? "",
  },

  Fronend: {
    base: config.get<string>("frontend_base_url") ?? "",
    home: config.get<string>("frontend_home_page_url") ?? "",
  },
};
