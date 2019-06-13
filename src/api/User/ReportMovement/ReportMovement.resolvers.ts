import { ReportMovementMutationArgs, ReportMovementResponse } from "src/types/graphql";
import { Resolvers } from "src/types/resolvers";

import User from "../../../entities/User";
import { privateResolver } from "../../../middlewares";
import cleanNullArgs from "../../../utils/cleanNullArgs";

const resolvers: Resolvers = {
  Mutation: {
    ReportMovement: privateResolver(
      async (
        _,
        args: ReportMovementMutationArgs,
        { req }
      ): Promise<ReportMovementResponse> => {
        const user: User = req.user;
        const notNullArgs = cleanNullArgs(args);
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
