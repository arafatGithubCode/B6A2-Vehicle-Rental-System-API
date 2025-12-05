import { pool } from "../../config/db";
import { allowedVehicleType, vehicleAvailableStatus } from "../../types";

const createVehicle = async (payload: Record<string, unknown>) => {
  const id = crypto.randomUUID();
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  // vehicle type check
  if (!allowedVehicleType.includes((type as string).toLowerCase())) {
    throw new Error(
      "Invalid type selected. Allowed types are car | bike | van | suv"
    );
  }

  // check positive value for rent price
  if ((daily_rent_price as number) < 0) {
    throw new Error("Daily rent price cannot be negative.");
  }

  // check vehicle available type
  if (
    !vehicleAvailableStatus.includes(
      (availability_status as string).toLowerCase()
    )
  ) {
    throw new Error(
      "Invalid vehicle available status is selected. Allowed status are available or booked."
    );
  }

  const result = await pool.query(
    `INSERT INTO vehicles(id, vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      id,
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

const getSingleVehicleById = async (vehicleId: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicleId,
  ]);
  return result;
};

// vehicle details, daily rent price or availability status

const updateSingleVehicleById = async (
  payload: Record<string, unknown>,
  vehicleId: string
) => {
  const fieldsToUpdate: string[] = [];
  const valuesToUpdate = [];
  let index = 1;

  for (const key in payload) {
    if (payload[key]) {
      fieldsToUpdate.push(`${key}=$${index}`);
      valuesToUpdate.push(payload[key]);
      index++;
    }
  }

  if (fieldsToUpdate.length === 0) {
    throw new Error("You didn't select any field to update.");
  }

  valuesToUpdate.push(vehicleId);

  const result = await pool.query(
    `UPDATE vehicles SET ${fieldsToUpdate.join(", ")}  WHERE id=$${
      fieldsToUpdate.length + 1
    } RETURNING *`,
    valuesToUpdate
  );
  return result;
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getSingleVehicleById,
  updateSingleVehicleById,
};
