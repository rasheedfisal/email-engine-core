/**
 * Express router paths go here.
 */

export default {
  Base: "/api",
  Auth: {
    Base: "/auth",
    Logout: "/logout",
  },
  Mail: {
    Base: "/mail",
  },
  User: {
    Base: "/user",
  },
} as const;
