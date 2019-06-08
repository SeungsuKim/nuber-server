import User from "src/entities/User";
import { EmailSiginInResponse, EmailSignInMutationArgs } from "src/types/graphql";
import { Resolvers } from "src/types/resolvers";

const resolvers: Resolvers = {
  Mutation: {
    EmailSignIn: async (
      _,
      args: EmailSignInMutationArgs
    ): EmailSiginInResponse => {
      const { email } = args;
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return {
            ok: false,
            error: "No user found with the email",
            toekn: null
          };
        }

        return {
          ok: false,
          error: "해당 이메일"
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
