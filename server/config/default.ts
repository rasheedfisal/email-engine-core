export default {
  // ## Environment ##
  node_env: "development",

  // ## Server ##
  port: "5000",
  host: "localhost",

  // ## Authentication ##
  cookie_domain: "localhost",
  cookie_path: "/",
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
