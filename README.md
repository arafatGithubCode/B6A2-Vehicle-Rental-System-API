# 🚗 Vehicle Rental System

A backend API for managing vehicles, users, and bookings.

🔗 **Live URL:** https://b6-a2-express-jwt.vercel.app/

---

## 📌 Features

- Vehicle management (add, update, delete, view)
- Customer & admin user roles
- Booking system with auto price calculation
- JWT authentication & role-based authorization
- PostgreSQL database with three main tables:
  - **Users**
  - **Vehicles**
  - **Bookings**

---

## 🛠 Tech Stack

- Node.js + TypeScript
- Express.js
- PostgreSQL
- bcrypt (password hashing)
- JSON Web Token (JWT)

---

## 🔐 Auth Overview

- Users can sign up and sign in.
- JWT is required for protected routes.
- Roles:
  - **Admin** – full access
  - **Customer** – manage own bookings and profile

---

## 📘 Main API Endpoints

### Auth

| Method | Endpoint              | Access |
| ------ | --------------------- | ------ |
| POST   | `/api/v1/auth/signup` | Public |
| POST   | `/api/v1/auth/signin` | Public |

### Vehicles

| Method | Endpoint               | Access |
| ------ | ---------------------- | ------ |
| POST   | `/api/v1/vehicles`     | Admin  |
| GET    | `/api/v1/vehicles`     | Public |
| GET    | `/api/v1/vehicles/:id` | Public |
| PUT    | `/api/v1/vehicles/:id` | Admin  |
| DELETE | `/api/v1/vehicles/:id` | Admin  |

### Users

| Method | Endpoint            | Access       |
| ------ | ------------------- | ------------ |
| GET    | `/api/v1/users`     | Admin        |
| PUT    | `/api/v1/users/:id` | Admin / Self |
| DELETE | `/api/v1/users/:id` | Admin        |

### Bookings

| Method | Endpoint               | Access           |
| ------ | ---------------------- | ---------------- |
| POST   | `/api/v1/bookings`     | Customer / Admin |
| GET    | `/api/v1/bookings`     | Role-based       |
| PUT    | `/api/v1/bookings/:id` | Role-based       |

---

## 📄 Notes

- Vehicle availability updates automatically on booking and return.
- All endpoints follow the exact structure defined in the API specification.

---

### ✅ Assignment Completed — B6A2 by Arafat Hossain
