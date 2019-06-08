import { FacebookConnectMutationArgs, FacebookConnectResponse } from "src/types/graphql";

import User from "../../../entities/User";
import { Resolvers } from "../../../types/resolvers";

const resolvers: Resolvers = {
  Mutation: {
    FacebookConnect: async (
      _,
      args: FacebookConnectMutationArgs
    ): Promise<FacebookConnectResponse> => {
      const { facebookId } = args;
      try {
        const existingUser = await User.findOne({ facebookId });
        if (existingUser) {
          return {
            ok: true,
            error: null,
            token: "Coming soon, already"
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
        await User.create({
          ...args,
          profilePhoto: `http://grpah.facebook.com/${facebookId}/picture?type=squre`
        }).save();
        return {
          ok: true,
          error: null,
          token: "Comming soon, created"
        };
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
