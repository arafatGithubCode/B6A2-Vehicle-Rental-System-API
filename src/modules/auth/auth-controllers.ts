import { Request, Response } from "express";
import errorHandler from "../../utils/error-handler";
import sendJSON from "../../utils/send-json";
import { authServices } from "./auth-services";

const signup = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signup(req.body);

    if (result.rows.length === 0) {
      throw new Error("Failed to signup. Try again later.");
    }

    sendJSON(
      201,
      true,
      res,
      `${result.rows[0].name} registered successfully.`,
      result.rows[0]
    );
  } catch (error) {
    sendJSON(500, false, res, errorHandler(error));
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authServices.signin(email, password);

    sendJSON(200, true, res, "Signin successful!", { token, user });
  } catch (error) {
    sendJSON(500, false, res, errorHandler(error));
  }
};

export const authController = { signup, signin };
