import { Router } from "express";
import auth from "../../middlewares/auth";
import { bookingControllers } from "./booking-controllers";

const router = Router();

// POST:vehicleId-> create a booking
router.post(
  "/",
  auth(["admin", "customer"]),
  bookingControllers.createBookingByVehicleId
);

// GET-> get all bookings based on role
router.get(
  "/",
  auth(["customer", "admin"]),
  bookingControllers.getAllBookingsByRole
);

// PUT:bookingId-> update booking based on role & business logic
router.put(
  "/:bookingId",
  auth(["admin", "customer"]),
  bookingControllers.updateBookingStatus
);

export const bookingRoutes = router;
