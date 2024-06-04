import { User } from "@src/models/users";
import elasticSearchClient from "./elasticSearchClient";

export class UserRepository {
  static async findUserByOAuthId(
    provider: string,
    userId: string
  ): Promise<User | null> {
    const { hits } = await elasticSearchClient.search({
      index: "users",
      body: {
        query: {
          match: {
            [`providers.${provider}.id`]: userId,
          },
        },
      },
    });

    if (hits.hits.length > 0) {
      return hits.hits[0]._source as User;
    }
    return null;
  }

  static async getUserById(id: string): Promise<User | null> {
    const result = await elasticSearchClient.get({
      index: "users",
      id,
    });

    if (result.found) {
      return result._source as User;
    }
    return null;
  }

  static async createUser(user: User): Promise<void> {
    await elasticSearchClient.index({
      index: "users",
      id: user.id,
      body: user,
    });
  }

  static async updateUser(user: User): Promise<void> {
    await elasticSearchClient.update({
      index: "users",
      id: user.id,
      body: {
        doc: user,
      },
      refresh: true,
    });
  }
}
