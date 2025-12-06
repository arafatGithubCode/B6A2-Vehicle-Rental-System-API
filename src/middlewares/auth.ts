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
        const error = new Error("token expired!");
        error.statusCode = 401;
        throw error;
      }

      const decoded = jwt.verify(
        token,
        config.jwt.secrete as string
      ) as JwtPayload;

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role.toLowerCase())) {
        const error = new Error("Forbidden!!!");
        error.statusCode = 403;
        throw error;
      }

      next();
    } catch (error) {
      const { message, statusCode } = errorHandler(error);
      sendJSON(statusCode, false, res, message);
    }
  };
};

export default auth;
