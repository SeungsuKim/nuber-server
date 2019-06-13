import { EditPlaceMutationArgs, EditPlaceResponse } from "src/types/graphql";
import { Resolvers } from "src/types/resolvers";

import Place from "../../../entities/Place";
import User from "../../../entities/User";
import { privateResolver } from "../../../middlewares";
import cleanNullArgs from "../../../utils/cleanNullArgs";

const resolvers: Resolvers = {
  Mutation: {
    EditPlace: privateResolver(
      async (
        _,
        { placeId, ...args }: EditPlaceMutationArgs,
        { req }
      ): Promise<EditPlaceResponse> => {
        const user: User = req.user;
        try {
          const place = await Place.findOne({ id: placeId });
          if (place) {
            if (place.userId === user.id) {
              const notNullArgs = cleanNullArgs(args);
              await Place.update({ id: placeId }, { ...notNullArgs });
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
