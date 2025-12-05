import express, { NextFunction, Request, Response } from "express";
import { initDB } from "./config/db";
import { authRoutes } from "./modules/auth/auth-routes";
import { userRoutes } from "./modules/user/user-routes";
import { vehicleRouter } from "./modules/vehicle/vehicle-routes";
import errorHandler from "./utils/error-handler";
import sendJSON from "./utils/send-json";

const app = express();

app.use(express.json());
// initialize database
initDB();

// referred the auth routes
app.use("/api/v1/auth", authRoutes);
// referred the vehicles routes
app.use("/api/v1/vehicles", vehicleRouter);
// referred the users routes
app.use("/api/v1/users", userRoutes);

// health check
app.get("/api/v1/health", (_req, res) => {
  res.status(200).send("The health is ok.");
});

// not route found error
app.use((_req: Request, res: Response) => {
  sendJSON(404, false, res, "Route not found!");
});

// run time error
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  sendJSON(500, false, res, errorHandler(err));
});

export default app;
