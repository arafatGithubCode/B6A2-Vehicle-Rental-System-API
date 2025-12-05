import express, { NextFunction, Request, Response } from "express";
import { initDB } from "./config/db";
import errorHandler from "./utils/error-handler";
import sendJSON from "./utils/send-json";

const app = express();

app.use(express.json());
// initialize database
initDB();

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
