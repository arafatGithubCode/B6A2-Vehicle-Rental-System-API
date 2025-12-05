import { Request, Response } from "express";
import errorHandler from "../../utils/error-handler";
import sendJSON from "../../utils/send-json";
import { userServices } from "./user-services";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsers();
    if (result.rows.length === 0) {
      sendJSON(200, true, res, "Users not found.");
    }
    sendJSON(200, true, res, "Users retrieved successfully", result.rows);
  } catch (error) {
    sendJSON(500, false, res, errorHandler(error));
  }
};
const updateUserById = async (req: Request, res: Response) => {
  try {
    const result = await userServices.updateUserById(
      req.body,
      req.params.userId!
    );
    if (result.rows.length === 0) {
      throw new Error("Failed to update this user!");
    }

    sendJSON(201, true, res, "User updated successfully", result.rows[0]);
  } catch (error) {
    sendJSON(500, false, res, errorHandler(error));
  }
};
// const getAllUsers = async (req: Request, res: Response) => {
//     try {

//     } catch (error) {
//         sendJSON(500, false, res, errorHandler(error))
//     }
// }

export const userControllers = { getAllUsers, updateUserById };
