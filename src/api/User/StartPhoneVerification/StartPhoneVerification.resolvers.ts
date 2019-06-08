import { Resolvers } from "src/types/resolvers";

import { sendVerificationSMS } from "../../../api/utils/sendSMS";
import Verification from "../../../entities/Verification";
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
        await sendVerificationSMS(newVerification.payload, newVerification.key);
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
  }
};

export default resolvers;
