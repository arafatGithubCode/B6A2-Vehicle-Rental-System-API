import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const updateUserById = async (
  payload: Record<string, unknown>,
  userId: string
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

  valuesToUpdate.push(userId);

  const result = await pool.query(
    `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id=$${
      valuesToUpdate.length
    } RETURNING *`,
    valuesToUpdate
  );

  return result;
};

export const userServices = { getAllUsers, updateUserById };
