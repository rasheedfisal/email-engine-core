import express from "express";
import passport from "../Strategy/passport";
import { AuthController } from "@src/controllers/AuthController";
import Paths from "@src/constants/Paths";
import EnvVars from "@src/constants/EnvVars";

const router = express.Router();

const oauthProviders = EnvVars.providers.map((x) => ({
  name: x.name,
  scopes: x.scope,
}));
oauthProviders.forEach((provider) => {
  router.get(
    `/${provider.name}`,
    passport.authenticate(provider.name, {
      scope: provider.scopes,
    })
  );
  router.get(
    `/${provider.name}/callback`,
    passport.authenticate(provider.name, { failureRedirect: "/" }),
    (req, res, next) =>
      AuthController.handleOAuthCallback(req, res, provider.name)
  );
});

router.post(`${Paths.Auth.Logout}`, (req, res, next) => {
  // req.logout();
  // res.redirect(EnvVars.Fronend.base);
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send("logged out successfully");
  });
});

export default router;
