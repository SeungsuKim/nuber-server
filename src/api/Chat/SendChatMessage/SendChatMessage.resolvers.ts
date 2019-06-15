import { SendChatMessageMutationArgs, SendChatMessageResponse } from "src/types/graphql";
import { Resolvers } from "src/types/resolvers";

import Chat from "../../../entities/Chat";
import Message from "../../../entities/Message";
import User from "../../../entities/User";
import { privateResolver } from "../../../middlewares";

const resolvers: Resolvers = {
  Mutation: {
    SendChatMessage: privateResolver(
      async (
        _,
        { text, chatId }: SendChatMessageMutationArgs,
        { req }
      ): Promise<SendChatMessageResponse> => {
        const user: User = req.user;
        try {
          const chat = await Chat.findOne({ id: chatId });
          if (chat) {
            if (chat.passenger === user.id || chat.driverId === user.id) {
              const message = await Message.create({
                text,
                chat,
                user
              }).save();
              return {
                ok: true,
                error: null,
                message
              };
            }
            return {
              ok: false,
              error: "Not authorized",
              message: null
            };
          }
          return {
            ok: false,
            error: "Chat not found",
            message: null
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            message: null
          };
        }
      }
    )
  }
};

export default resolvers;
