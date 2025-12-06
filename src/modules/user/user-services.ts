import { pool } from "../../config/db";
import { roleType } from "../../types";

const getAllUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const updateUserById = async (
  payload: Record<string, unknown>,
  userId: string,
  role: string
) => {
  const fieldsToUpdate: string[] = [];
  const valuesToUpdate = [];

  let index = 1;
  let isRoleUpdate = false;

  for (const key in payload) {
    if (key.toLowerCase() === "role") {
      isRoleUpdate = true;
    }
    if (payload[key]) {
      fieldsToUpdate.push(`${key}=$${index}`);
      valuesToUpdate.push(payload[key]);
      index++;
    }
  }

  // prevent role update by customer
  if (isRoleUpdate && role === roleType.customer) {
    throw new Error("You cannot update your role.");
  }

  valuesToUpdate.push(userId);

  const result = await pool.query(
    `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id=$${
      valuesToUpdate.length
    } RETURNING *`,
    valuesToUpdate
  );

  return result;
};

const deleteUserById = async (userId: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [userId]);

  if (result.rows.length === 0) {
    throw new Error("This user does not exists.");
  }

  const bookingResult = await pool.query(`SELECT * FROM users WHERE id=$1`, [
    userId,
  ]);

  if (bookingResult.rows.length > 0) {
    const hasActiveBooking = bookingResult.rows.some(
      (booking) => booking.status === "active"
    );

    console.log({ hasActiveBooking });

    if (hasActiveBooking) {
      throw new Error(
        "This user cannot be deleted because this user has an active booking"
      );
    }
  }

  await pool.query(`DELETE FROM users WHERE id=$1`, [userId]);
};

export const userServices = { getAllUsers, updateUserById, deleteUserById };
