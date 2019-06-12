import { NextFunction, Response } from "express";

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
