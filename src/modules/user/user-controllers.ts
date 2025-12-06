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
    sendJSON(500, false, res, errorHandler(error));
  }
};
const updateUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const loggedInUserId = req.user!.id;
    const role = req.user!.role;

    console.log(req.user);

    // prevent other users details update by customer role
    if (role === roleType.customer && userId !== loggedInUserId) {
      throw new Error("You cannot update others user details");
    }
    const result = await userServices.updateUserById(req.body, userId!, role!);
    if (result.rows.length === 0) {
      throw new Error("This user does not exists.");
    }

    sendJSON(201, true, res, "User updated successfully", result.rows[0]);
  } catch (error) {
    sendJSON(500, false, res, errorHandler(error));
  }
};

const deleteUserById = async (req: Request, res: Response) => {
  try {
    await userServices.deleteUserById(req.params.userId!);
    sendJSON(200, true, res, "User deleted successfully.");
  } catch (error) {
    sendJSON(500, false, res, errorHandler(error));
  }
};

export const userControllers = { getAllUsers, updateUserById, deleteUserById };
