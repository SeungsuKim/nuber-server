import Verification from "src/entities/Verification";
import { Resolvers } from "src/types/resolvers";

import {
  StartPhoneVerificationMutationArgs,
  StartPhoneVerificationResponse
} from "../../../types/graphql";

const resolvers: Resolvers = {
  Mutation: {
    StartPhoneVerification: async (
      _,
      { phoneNumber }: StartPhoneVerificationMutationArgs
    ): Promise<StartPhoneVerificationResponse> => {
      try {
        const existingVerification = await Verification.findOne({
          payload: phoneNumber
        });
        if (existingVerification) {
          existingVerification.remove();
        }
        const newVerification = await Verification.create({
          payload: phoneNumber,
          target: "PHONE"
        }).save();
      } catch (error) {
        return {
          ok: false,
          error: error.message
        };
      }
    }
  }
};

export default resolvers;
