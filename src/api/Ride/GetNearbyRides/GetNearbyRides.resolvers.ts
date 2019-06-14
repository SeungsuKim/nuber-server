import { GetNearbyRidesResponse } from "src/types/graphql";
import { Resolvers } from "src/types/resolvers";
import { Between } from "typeorm";

import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import { privateResolver } from "../../../middlewares";

const resolvers: Resolvers = {
  Query: {
    GetNearbyRides: privateResolver(
      async (_, __, { req }): Promise<GetNearbyRidesResponse> => {
        const user: User = req.user;
        if (user.isDriving) {
          const { lastLat, lastLng } = user;
          try {
            const rides = await Ride.find({
              status: "REQUESTING",
              pickUpLat: Between(lastLat - 0.05, lastLat + 0.05),
              pickUpLng: Between(lastLng - 0.05, lastLng + 0.05)
            });
            return {
              ok: true,
              error: null,
              rides
            };
          } catch (error) {
            return {
              ok: false,
              error: error.message,
              rides: null
            };
          }
        }
        return {
          ok: false,
          error: "You are not a driver",
          rides: null
        };
      }
    )
  }
};

export default resolvers;
