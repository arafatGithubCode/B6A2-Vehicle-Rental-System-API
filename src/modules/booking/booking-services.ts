import { pool } from "../../config/db";
import { roleType } from "../../types";
import getNumberOfDays from "../../utils/get-number-of-days";

const createBookingByVehicleId = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  // retrieve the vehicle info by vehicle id
  const vehicleResult = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicle_id,
  ]);

  if (vehicleResult.rows.length === 0) {
    throw new Error("This vehicle does not exists.");
  }

  // check status -> can't be booked if already booked
  if (vehicleResult.rows[0].availability_status === "booked") {
    throw new Error("This vehicle is already booked. Please try another.");
  }

  // check future date is selected
  if (
    new Date(rent_end_date as string).getTime() <
    new Date(rent_start_date as string).getTime()
  ) {
    throw new Error("Please select upcoming date");
  }

  // price calculation
  const numberOfDays = getNumberOfDays(
    rent_start_date as Date,
    rent_end_date as Date
  );
  const total_price =
    Number(vehicleResult.rows[0].daily_rent_price) * numberOfDays;

  // create the booking
  const bookingId = crypto.randomUUID();
  const bookingResult = await pool.query(
    `INSERT INTO bookings(id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      bookingId,
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      "active",
    ]
  );

  const updatedVehicleResult = await pool.query(
    `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,
    ["booked", vehicle_id]
  );

  const vehicle_name = updatedVehicleResult.rows[0].vehicle_name;
  const daily_rent_price = updatedVehicleResult.rows[0].daily_rent_price;

  return {
    bookingResult: bookingResult.rows[0],
    vehicle_name,
    daily_rent_price,
  };
};

const getAllBookingsByRole = async (role: string, customer_id?: string) => {
  if (role === roleType.customer) {
    const result = await pool.query(
      `SELECT * FROM bookings WHERE customer_id =$1`,
      [customer_id]
    );
    return result;
  } else if (role === roleType.admin) {
    const result = await pool.query(`SELECT * FROM bookings`);
    return result;
  } else {
    throw new Error("Please select valid role.");
  }
};

const updateBookingStatus = async (
  bookingId: string,
  role: string,
  status: string
) => {
  // get booking details by booking id
  const bookingResult = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);

  if (bookingResult.rows.length === 0) {
    throw new Error("This booking does not exists.");
  }

  const vehicleId = bookingResult.rows[0].vehicle_id;

  const currentDate = new Date();
  const rent_end_date = new Date(bookingResult.rows[0].rent_end_date);
  const isBookingDateEnded = currentDate.getTime() > rent_end_date.getTime();

  if (isBookingDateEnded) {
    // System: Auto-mark as "returned" when period ends
    const updatedBookingResult = await pool.query(
      `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
      ["returned", bookingId]
    );

    // updates vehicle to "available"
    const updatedVehicleResult = await pool.query(
      `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,
      ["available", vehicleId]
    );

    return {
      action: "auto",
      message: "Booking marked as returned. Vehicle is now available",
      data: updatedBookingResult.rows,
      vehicle: {
        availability_status: updatedVehicleResult.rows[0].availability_status,
      },
    };
  } else if (!isBookingDateEnded && role === roleType.customer) {
    // Customer: Cancel booking (before start date only)
    if (bookingResult.rows[0].status === "cancelled") {
      throw new Error("This booking was already cancelled.");
    }

    if (bookingResult.rows[0].status !== "active") {
      throw new Error(
        "You can only cancel your active booking before starting date."
      );
    }

    const currentDate = new Date();
    const rent_start_date = new Date(bookingResult.rows[0].rent_start_date);

    if (currentDate.getTime() > rent_start_date.getTime()) {
      throw new Error(
        "Booking status cannot be changed because this booking is already started."
      );
    }

    if (status !== "cancelled") {
      throw new Error(
        "Invalid status selected. You can only cancelled the booking before starting date."
      );
    }

    const updatedBookingResult = await pool.query(
      `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
      [status, bookingId]
    );

    return {
      action: "cancelled",
      message: "Booking cancelled successfully",
      data: updatedBookingResult.rows,
    };
  } else if (!isBookingDateEnded && role === roleType.admin) {
    // Admin: Mark as "returned" (updates vehicle to "available")

    if (bookingResult.rows[0].status === "returned") {
      throw new Error("The booking status was already updated to returned.");
    }
    if (status !== "returned") {
      throw new Error("Admin can only update booking status to return.");
    }

    const updatedBookingResult = await pool.query(
      `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
      [status, bookingId]
    );

    // updates vehicle to "available"
    const updatedVehicleResult = await pool.query(
      `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,
      ["available", vehicleId]
    );

    return {
      action: "returned",
      message: "Booking marked as returned. Vehicle is now available",
      data: updatedBookingResult.rows,
      vehicle: {
        availability_status: updatedVehicleResult.rows[0].availability_status,
      },
    };
  } else {
    throw new Error("Invalid selection. check valid status and user's role");
  }
};
export const bookingServices = {
  createBookingByVehicleId,
  getAllBookingsByRole,
  updateBookingStatus,
};
