import { NextFunction, Response } from "express";
import { Context } from "graphql-yoga/dist/types";

import decodeJWT from "./utils/decodeJWT";

export const jwt = async (
  req,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authorization = req.get("Authorization");
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    const user = await decodeJWT(token);
    req.user = user ? user : undefined;
  }
  next();
};

export const privateResolver = resolverFunction => async (
  parent,
  args,
  context: Context,
  info
) => {
  if (!context.req.user) {
    throw new Error("No JWT");
  }
  return resolverFunction(parent, args, context, info);
};
