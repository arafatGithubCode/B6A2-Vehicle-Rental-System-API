import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import errorHandler from "../utils/error-handler";
import sendJSON from "../utils/send-json";

const auth = (roles: ("admin" | "customer")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        throw new Error("token expired!");
      }

      const decoded = jwt.verify(
        token,
        config.jwt.secrete as string
      ) as JwtPayload;

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role.toLowerCase())) {
        throw new Error("You have no access to do this.");
      }

      next();
    } catch (error) {
      sendJSON(500, false, res, errorHandler(error));
    }
  };
};

export default auth;
