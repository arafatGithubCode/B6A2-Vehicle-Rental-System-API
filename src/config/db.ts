import { Pool } from "pg";
import config from ".";

const pool = new Pool({
  connectionString: config.db.connectionString,
});

const initDB = async () => {
  // create user table
  await pool.query(`CREATE TABLE IF NOT EXISTS users(
        id UUID PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(200) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(50) NOT NULL,
        CHECK (email = LOWER(email))
        )`);

  // create vehicles table
  await pool.query(`CREATE TABLE IF NOT EXISTS vehicles(
        id UUID PRIMARY KEY,
        vehicle_name VARCHAR(300) NOT NULL,
        type VARCHAR(30) NOT NULL,
        registration_number SERIAL UNIQUE NOT NULL,
        daily_rent_price NUMERIC(10, 2) NOT NULL,
        availability_status VARCHAR(50) NOT NULL
        )`);

  // create booking table
  await pool.query(`CREATE TABLE IF NOT EXISTS bookings(
        id UUID PRIMARY KEY,
        customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE DEFAULT NOW(),
        rent_end_date DATE DEFAULT NOW(),
        total_price NUMERIC(10, 2) NOT NULL,
        status VARCHAR(100) NOT NULL
        )`);
};

export { initDB, pool };
