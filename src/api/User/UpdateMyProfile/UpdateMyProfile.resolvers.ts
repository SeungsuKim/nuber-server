import { UpdateMyProfileMutationArgs, UpdateMyProfileResponse } from "src/types/graphql";
import { Resolvers } from "src/types/resolvers";

import User from "../../../entities/User";
import { privateResolver } from "../../../middlewares";

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(
      async (
        _,
        args: UpdateMyProfileMutationArgs,
        { req }
      ): Promise<UpdateMyProfileResponse> => {
        const user: User = req.user;
        const notNullArgs = {};
        Object.keys(args).forEach(key => {
          if (args[key] !== null) {
            notNullArgs[key] = args[key];
          }
        });
        try {
          await User.update({ id: user.id }, { ...notNullArgs });
          return {
            ok: true,
            error: null
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message
          };
        }
      }
    )
  }
};

export default resolvers;
