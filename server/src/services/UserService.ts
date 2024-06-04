import { UserRepository } from "../repos/UserRepo";
import { User } from "../models/users";

export class UserService {
  static async findOrCreateUser(
    provider: string,
    profile: any,
    token: string
  ): Promise<User> {
    let user = await UserRepository.findUserByOAuthId(provider, profile.id);
    if (!user) {
      user = {
        id: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
        providers: {
          [provider]: {
            id: profile.id,
            token,
          },
        },
      };
      await UserRepository.createUser(user);
    }
    return user;
  }

  static async getUserById(id: string): Promise<User | null> {
    return await UserRepository.getUserById(id);
  }

  static async findUserByOAuthId(
    provider: string,
    userId: string
  ): Promise<User | null> {
    return await UserRepository.findUserByOAuthId(provider, userId);
  }

  static async updateUser(user: User): Promise<void> {
    await UserRepository.updateUser(user);
  }
  static async createUser(user: User): Promise<void> {
    await UserRepository.createUser(user);
  }
}
