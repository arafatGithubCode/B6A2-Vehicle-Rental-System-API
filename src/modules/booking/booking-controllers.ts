import { Request, Response } from "express";
import { roleType } from "../../types";
import errorHandler from "../../utils/error-handler";
import sendJSON from "../../utils/send-json";
import { bookingServices } from "./booking-services";

const createBookingByVehicleId = async (req: Request, res: Response) => {
  try {
    const { bookingResult, vehicle_name, daily_rent_price } =
      await bookingServices.createBookingByVehicleId(req.body);

    const bookingWithVehicle = {
      ...bookingResult,
      vehicle: { vehicle_name, daily_rent_price },
    };

    sendJSON(
      201,
      true,
      res,
      "Booking created successfully",
      bookingWithVehicle
    );
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    sendJSON(statusCode, false, res, message);
  }
};

const getAllBookingsByRole = async (req: Request, res: Response) => {
  try {
    const { id, role } = req.user!;
    if (role === roleType.customer) {
      const result = await bookingServices.getAllBookingsByRole(role, id);

      if (result.rows.length === 0) {
        sendJSON(200, true, res, "No bookings found!", []);
      }
      sendJSON(200, true, res, "Bookings retrieved successfully", result.rows);
    } else {
      const result = await bookingServices.getAllBookingsByRole(role);
      if (result.rows.length === 0) {
        sendJSON(200, true, res, "No bookings found!", []);
      }

      sendJSON(200, true, res, "Bookings retrieved successfully", result.rows);
    }
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    sendJSON(statusCode, false, res, message);
  }
};

const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.bookingId;
    const role = req.user!.role;
    const status = req.body.status;

    const result = await bookingServices.updateBookingStatus(
      bookingId!,
      role,
      status
    );

    if (result?.action === "cancelled") {
      if (result?.data.length === 0) {
        throw new Error("Failed to cancel booking's status");
      } else {
        sendJSON(201, true, res, result.message, result.data[0]);
      }
    }

    if (result?.action === "returned" || result?.action === "auto") {
      if (result?.data.length === 0) {
        throw new Error("Failed to update booking's status to returned");
      } else {
        sendJSON(201, true, res, result.message, {
          ...result.data[0],
          vehicle: result.vehicle,
        });
      }
    }
  } catch (error) {
    const { message, statusCode } = errorHandler(error);
    sendJSON(statusCode, false, res, message);
  }
};

export const bookingControllers = {
  createBookingByVehicleId,
  getAllBookingsByRole,
  updateBookingStatus,
};
