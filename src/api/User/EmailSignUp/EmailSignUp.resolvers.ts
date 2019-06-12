import Verification from "src/entities/Verification";
import { EmailSignUpMutationArgs, EmailSignUpResponse } from "src/types/graphql";
import { Resolvers } from "src/types/resolvers";

import User from "../../../entities/User";
import createJWT from "../../../utils/createJWT";

const resolvers: Resolvers = {
  Mutation: {
    EmailSignUp: async (
      _,
      args: EmailSignUpMutationArgs
    ): Promise<EmailSignUpResponse> => {
      const { email } = args;
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return {
            ok: false,
            error:
              "You already have an account with this email. Please sgin in instead.",
            token: null
          };
        }
        const user = await User.create({ ...args }).save();
        if (user.email) {
          const emailVerification = await Verification.create({
            payload: user.email,
            target: "EMAIL"
          });
        }
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
