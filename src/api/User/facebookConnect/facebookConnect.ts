import User from "src/entities/User";
import { FacebookConnectMutationArgs, FacebookConnectResponse } from "src/types/graphql";

import { Resolvers } from "../../../types/resolvers";

const resolvers: Resolvers = {
  Mutation: {
    facebookConnect: async (
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
        await User.create({
          ...args,
          profilePhoto: `http://grpah.facebook.com/${facebookId}/picture?type=squre`
        }).save();
        return {
          ok: true,
          error: null,
          token: "Comming soon"
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
