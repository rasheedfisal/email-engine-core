export default {
  // ## Environment ##
  node_env: "production",

  // ## Server ##
  port: 8181,
  host: "localhost",

  // ## Authentication ##
  cookie_domain: "localhost",
  cookie_path: "/",
  // # SECURE_COOKIE 'false' here for demo-ing. But ideally should be true.
  secure_cookie: false,
  http_only: false,
  signed: false,
  jwt_secret: "",
  cookie_secret: "",
  // # expires in 3 days
  cookie_exp: 259200000,

  outlook_client_id: "",
  outlook_client_secret: "",
  outlook_callbackURL: "",

  elastic_search_node: "",

  frontend_base_url: "http://localhost:3000",
  frontend_home_page_url: "/home",
};
