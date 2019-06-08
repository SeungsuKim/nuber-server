import { FacebookConnectMutationArgs, FacebookConnectResponse } from "src/types/graphql";

import User from "../../../entities/User";
import { Resolvers } from "../../../types/resolvers";
import createJWT from "../../../utils/createJWT";

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
            token: createJWT(existingUser.id)
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
        const user = await User.create({
          ...args,
          profilePhoto: `http://grpah.facebook.com/${facebookId}/picture?type=squre`
        }).save();
        return {
          ok: true,
          error: null,
          token: createJWT(user.id)
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
