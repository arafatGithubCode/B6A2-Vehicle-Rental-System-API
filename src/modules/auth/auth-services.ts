import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";
import { roleType } from "../../types";

const signup = async (payload: Record<string, unknown>) => {
  const id = crypto.randomUUID();
  const { name, email, password, phone, role } = payload;

  if (
    typeof role === "string" &&
    role !== roleType.admin &&
    role !== roleType.customer
  ) {
    throw new Error(
      "Invalid role selected. Allowed roles are admin or customer."
    );
  }

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(id, name, email, password, phone, role) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
    [id, name, email, hashedPassword, phone, role]
  );

  return result;
};

const signin = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    throw new Error("User does not exist.");
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  delete user.password;

  if (!isMatch) {
    throw new Error("Bad Credentials!!!");
  }

  const token = jwt.sign(user, config.jwt.secrete as string, {
    expiresIn: "7d",
  });

  return { token, user };
};
export const authServices = { signup, signin };
