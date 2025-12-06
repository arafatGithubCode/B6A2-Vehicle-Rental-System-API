import { Request, Response } from "express";
import { roleType } from "../../types";
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
    const { message, statusCode } = errorHandler(error);
    sendJSON(statusCode, false, res, message);
  }
};
const updateUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const loggedInUserId = req.user!.id;
    const role = req.user!.role;

    // prevent other users details update by customer role
    if (role === roleType.customer && userId !== loggedInUserId) {
      const error = new Error("You cannot update others user details");
      error.statusCode = 403;
      throw error;
    }
    const result = await userServices.updateUserById(req.body, userId!, role!);
    if (result.rows.length === 0) {
      const error = new Error("This user does not exists.");
      error.statusCode = 404;
      throw error;
    }

    sendJSON(201, true, res, "User updated successfully", result.rows[0]);
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    sendJSON(statusCode, false, res, message);
  }
};

const deleteUserById = async (req: Request, res: Response) => {
  try {
    await userServices.deleteUserById(req.params.userId!);
    sendJSON(200, true, res, "User deleted successfully.");
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    sendJSON(statusCode, false, res, message);
  }
};

export const userControllers = { getAllUsers, updateUserById, deleteUserById };
