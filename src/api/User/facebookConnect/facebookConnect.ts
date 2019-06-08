import User from "src/entities/User";
import { FacebookConnectMutationArgs, FacebookConnectResponse } from "src/types/graphql";

import { Resolvers } from "../../../types/resolvers";

const resolvers: Resolvers = {
  Mutation: {
    facebookConnect: async (
      _,
      { firstName, lastName, facebookId }: FacebookConnectMutationArgs
    ): Promise<FacebookConnectResponse> => {
      try {
        const existingUser = await User.findOne({ facebookId });
        if (existingUser) {
          return {
            ok: true,
            error: null,
            token: "Coming soon"
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null
        };
      }
      try {
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null
        };
      }
    }
  }
};

export default resolvers;
