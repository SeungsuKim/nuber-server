import { EmailSiginInResponse, EmailSignInMutationArgs } from "src/types/graphql";
import { Resolvers } from "src/types/resolvers";

import User from "../../../entities/User";

const resolvers: Resolvers = {
  Mutation: {
    EmailSignIn: async (
      _,
      { email, password }: EmailSignInMutationArgs
    ): Promise<EmailSiginInResponse> => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return {
            ok: false,
            error: "No user found with the email",
            token: null
          };
        }
        const checkPassword = await user.comparePassword(password);
        if (checkPassword) {
          return {
            ok: true,
            error: null,
            token: "Comming soon"
          };
        }
        return {
          ok: false,
          error: "Wrong password",
          token: null
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
