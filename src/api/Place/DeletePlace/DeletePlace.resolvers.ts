import { DeletePlaceMutationArgs, DeletePlaceResponse } from "src/types/graphql";
import { Resolvers } from "src/types/resolvers";

import Place from "../../../entities/Place";
import User from "../../../entities/User";
import { privateResolver } from "../../../middlewares";

const resolvers: Resolvers = {
  Mutation: {
    DeletePlace: privateResolver(
      async (
        _,
        { placeId }: DeletePlaceMutationArgs,
        { req }
      ): Promise<DeletePlaceResponse> => {
        const user: User = req.user;
        try {
          const place = await Place.findOne({ id: placeId });
          if (place) {
            if (place.userId === user.id) {
              place.remove();
              return {
                ok: true,
                error: null
              };
            }
            return {
              ok: false,
              error: "Not authorized"
            };
          }
          return {
            ok: false,
            error: "Place not found"
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message
          };
        }
      }
    )
  }
};

export default resolvers;
