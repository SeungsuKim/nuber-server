import { ToogleDrivingModeResponse } from "src/types/graphql";
import { Resolvers } from "src/types/resolvers";

import User from "../../../entities/User";
import { privateResolver } from "../../../middlewares";

const resolvers: Resolvers = {
  Mutation: {
    ToogleDrivingMode: privateResolver(
      async (_, __, { req }): Promise<ToogleDrivingModeResponse> => {
        const user: User = req.user;
        user.isDriving = !user.isDriving;
        user.save();
        return {
          ok: true,
          error: null
        };
      }
    )
  }
};

export default resolvers;
