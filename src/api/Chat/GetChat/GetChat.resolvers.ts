import { GetChatQueryArgs, GetChatResponse } from "src/types/graphql";
import { Resolvers } from "src/types/resolvers";

import Chat from "../../../entities/Chat";
import User from "../../../entities/User";
import { privateResolver } from "../../../middlewares";

const resolvers: Resolvers = {
  Query: {
    GetChat: privateResolver(
      async (
        _,
        { chatId }: GetChatQueryArgs,
        { req }
      ): Promise<GetChatResponse> => {
        const user: User = req.user;
        try {
          const chat = await Chat.findOne(
            { id: chatId },
            { relations: ["messages"] }
          );
          if (chat) {
            if (chat.passengerId === user.id || chat.driverId === user.id) {
              return {
                ok: true,
                error: null,
                chat
              };
            }
            return {
              ok: false,
              error: "Not authorized",
              chat: null
            };
          }
          return {
            ok: false,
            error: "Chat not found",
            chat: null
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            chat: null
          };
        }
      }
    )
  }
};

export default resolvers;
