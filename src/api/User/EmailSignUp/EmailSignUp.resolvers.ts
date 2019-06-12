import { EmailSignUpMutationArgs, EmailSignUpResponse } from "src/types/graphql";
import { Resolvers } from "src/types/resolvers";

import User from "../../../entities/User";
import Verification from "../../../entities/Verification";
import createJWT from "../../../utils/createJWT";
import { sendVerificationEmail } from "../../../utils/sendEmail";

const resolvers: Resolvers = {
  Mutation: {
    EmailSignUp: async (
      _,
      args: EmailSignUpMutationArgs
    ): Promise<EmailSignUpResponse> => {
      const { email } = args;
      try {
        const phoneVerification = await Verification.findOne({
          payload: args.phoneNumber,
          verified: true
        });
        if (phoneVerification) {
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
            }).save();
            await sendVerificationEmail(user.fullName, emailVerification.key);
          }
          return {
            ok: true,
            error: null,
            token: createJWT(user.id)
          };
        } else {
          return {
            ok: false,
            error: "You haven't verified your phone number",
            token: null
          };
        }
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
