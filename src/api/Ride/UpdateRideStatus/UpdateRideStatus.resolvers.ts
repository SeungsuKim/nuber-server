import { UpdateRideStatusMutationArgs, UpdateRideStatusResponse } from "src/types/graphql";
import { Resolvers } from "src/types/resolvers";

import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import { privateResolver } from "../../../middlewares";

const resolvers: Resolvers = {
  Mutation: {
    UpdateRideStatus: privateResolver(
      async (
        _,
        { rideId, status }: UpdateRideStatusMutationArgs,
        { req, pubSub }
      ): Promise<UpdateRideStatusResponse> => {
        const user: User = req.user;
        if (user.isDriving) {
          try {
            let ride: Ride | undefined;
            if (status === "ACCEPTED") {
              ride = await Ride.findOne({ id: rideId, status: "REQUESTING" });
              if (ride) {
                ride.driver = user;
                user.isTaken = true;
                user.save();
              }
            } else {
              ride = await Ride.findOne({ id: rideId, driver: user });
            }
            if (ride) {
              ride.status = status;
              ride.save();
              pubSub.publish("rideUpdate", { RideStatusSubscription: ride });
              return {
                ok: true,
                error: null
              };
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
        return {
          ok: false,
          error: "You are not driving"
        };
      }
    )
  }
};

export default resolvers;
