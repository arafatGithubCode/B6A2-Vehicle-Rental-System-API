import { Request, Response } from "express";
import errorHandler from "../../utils/error-handler";
import sendJSON from "../../utils/send-json";
import { vehicleServices } from "./vehicle-services";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);

    if (result.rows.length === 0) {
      const error = new Error("Failed to create vehicle.");
      error.statusCode = 500;
      throw error;
    }

    const newVehicle = result.rows[result.rows.length - 1];

    sendJSON(
      201,
      true,
      res,
      `${newVehicle.vehicle_name} is created successfully.`,
      newVehicle
    );
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    sendJSON(statusCode, false, res, message);
  }
};

const getAllVehicles = async (_req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();

    if (result.rows.length === 0) {
      sendJSON(200, true, res, "No vehicles found", []);
    }

    sendJSON(200, true, res, "Vehicles retrieved successfully", result.rows);
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    sendJSON(statusCode, false, res, message);
  }
};

const getSingleVehicleById = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getSingleVehicleById(
      req.params.vehicleId!
    );
    if (result.rows.length === 0) {
      const error = new Error("This vehicle does not exists.");
      error.statusCode = 404;
      throw error;
    }
    sendJSON(200, true, res, "Vehicles retrieved successfully", result.rows[0]);
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    sendJSON(statusCode, false, res, message);
  }
};

const updateSingleVehicleById = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.updateSingleVehicleById(
      req.body,
      req.params.vehicleId!
    );
    if (result.rows.length === 0) {
      const error = new Error("This vehicle does not exists.");
      error.statusCode = 404;
      throw error;
    }
    sendJSON(200, true, res, "Vehicle updated successfully", result.rows[0]);
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    sendJSON(statusCode, false, res, message);
  }
};

const deleteVehicleById = async (req: Request, res: Response) => {
  try {
    await vehicleServices.deleteVehicleById(req.params.vehicleId!);
    sendJSON(200, true, res, "vehicle deleted successfully.");
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    sendJSON(statusCode, false, res, message);
  }
};

export const vehicleControllers = {
  createVehicle,
  getAllVehicles,
  getSingleVehicleById,
  updateSingleVehicleById,
  deleteVehicleById,
};
