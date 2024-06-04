import passport from "passport";

import { UserService } from "../services/UserService";
import EnvVars from "../constants/EnvVars";
import { User } from "../models/users";

passport.serializeUser((user, done) => {
  done(null, user?.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserService.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export interface StrategyOptions {
  name: string;
  Strategy: any; // Type is generic since it could be any strategy
  options: {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
  };
}

const providers = EnvVars.providers.map(
  (x) =>
    ({
      name: x.name,
      Strategy: x.strategy,
      options: {
        clientID: x.clientId,
        clientSecret: x.clientSecret,
        callbackURL: x.callbackURL,
      },
    } as StrategyOptions)
);

providers.forEach((provider) => {
  passport.use(
    provider.name,
    new provider.Strategy(
      provider.options,
      async (
        token: string,
        refreshToken: any,
        profile: any,
        done: (arg0: null, arg1: User | null) => void
      ) => {
        try {
          let user = await UserService.findUserByOAuthId(
            provider.name,
            profile.id
          );
          if (!user) {
            await UserService.createUser({
              id: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value,
              providers: {
                [provider.name]: {
                  id: profile.id,
                  token,
                },
              },
            });
          } else {
            user.providers[provider.name].token = token;
            await UserService.updateUser(user);
          }
          done(null, user);
        } catch (error) {
          console.error("Error during authentication:", error);
          done(error, null);
        }
      }
    )
  );
});

export default passport;
