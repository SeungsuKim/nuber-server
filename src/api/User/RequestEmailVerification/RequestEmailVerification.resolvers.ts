import { RequestEmailVerificationResponse } from "src/types/graphql";
import { Resolvers } from "src/types/resolvers";

import User from "../../../entities/User";
import Verification from "../../../entities/Verification";
import { privateResolver } from "../../../middlewares";
import { sendVerificationEmail } from "../../../utils/sendEmail";

const resolvers: Resolvers = {
  Mutation: {
    RequestEmailVerification: privateResolver(
      async (_, __, { req }): Promise<RequestEmailVerificationResponse> => {
        const user: User = req.user;
        if (user.email && !user.verifiedEmail) {
          if (user.email) {
            try {
              const oldVerification = await Verification.findOne({
                payload: user.email
              });
              if (oldVerification) {
                oldVerification.remove();
              }
              const newVerification = await Verification.create({
                payload: user.email,
                target: "EMAIL"
              }).save();
              await sendVerificationEmail(user.fullName, newVerification.key);
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
          return {
            ok: false,
            error: "Your user has no email to be verified"
          };
        }
        return {
          ok: false,
          error: "No eamil to verfied or already verified"
        };
      }
    )
  }
};

export default resolvers;
