import { GetRideQueryArgs, GetRideResponse } from "src/types/graphql";
import { Resolvers } from "src/types/resolvers";

import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import { privateResolver } from "../../../middlewares";

const resolvers: Resolvers = {
  Query: {
    GetRide: privateResolver(
      async (
        _,
        { rideId }: GetRideQueryArgs,
        { req }
      ): Promise<GetRideResponse> => {
        const user: User = req.user;
        try {
          const ride = await Ride.findOne({ id: rideId });
          if (ride) {
            if (ride.passengerId === user.id || ride.driverId === user.id) {
              return {
                ok: true,
                error: null,
                ride
              };
            }
            return {
              ok: false,
              error: "Not authorized",
              ride: null
            };
          }
          return {
            ok: false,
            error: "Ride not found",
            ride: null
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            ride: null
          };
        }
      }
    )
  }
};

export default resolvers;
