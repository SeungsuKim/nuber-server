import Ride from "src/entities/Ride";
import { UpdateRideStatusMutationArgs, UpdateRideStatusResponse } from "src/types/graphql";
import { Resolvers } from "src/types/resolvers";

import User from "../../../entities/User";
import { privateResolver } from "../../../middlewares";

const resolvers: Resolvers = {
  Mutation: {
    UpdateRideStatus: privateResolver(
      async (
        _,
        { rideId, status }: UpdateRideStatusMutationArgs,
        { req }
      ): Promise<UpdateRideStatusResponse> => {
        const user: User = req.user;
        if (user.isDriving) {
          try {
            const ride = await Ride.findOne({
              id: rideId,
              status: "REQUESTING"
            });
            if (ride) {
              ride.status = status;
              ride.save();
            }
            return {
              ok: false,
              error: "Cannot update ride"
            };
          } catch (error) {
            return {
              ok: false,
              error: error.message
            };
          }
        }
      }
    )
  }
};

export default resolvers;
