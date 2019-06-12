import { UpdateMyProfileMutationArgs } from "src/types/graphql";
import { Resolvers } from "src/types/resolvers";

import User from "../../../entities/User";
import { privateResolver } from "../../../middlewares";

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(
      async (_, args: UpdateMyProfileMutationArgs, { req }) => {
        const user: User = req.user;
        await User.update({ id: user.id }, {});
      }
    )
  }
};
