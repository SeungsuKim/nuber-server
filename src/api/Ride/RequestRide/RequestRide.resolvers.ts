import { RequestRideMutationArgs, RequestRideResponse } from "src/types/graphql";
import { Resolvers } from "src/types/resolvers";

import Ride from "../../../entities/Ride";
import User from "../../../entities/User";

const resolvers: Resolvers = {
  Mutation: {
    RequestRide: async (
      _,
      args: RequestRideMutationArgs,
      { req, pubSub }
    ): Promise<RequestRideResponse> => {
      const user: User = req.user;
      if (!user.isRiding && !user.isDriving) {
        try {
          const ride = await Ride.create({ ...args, passenger: user }).save();
          pubSub.publish("rideRequest", { NearbyRideSubscription: ride });
          user.isRiding = true;
          user.save();
          return {
            ok: true,
            error: null,
            ride
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            ride: null
          };
        }
      }
      return {
        ok: false,
        error: "You cannot request two rides or drive and request",
        ride: null
      };
    }
  }
};

export default resolvers;
