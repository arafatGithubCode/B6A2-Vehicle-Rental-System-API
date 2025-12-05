import { Response } from "express";

const sendJSON = (
  status: number,
  success: boolean,
  res: Response,
  message: string,
  data?: any,
  errors?: string
) => {
  return res.status(status).json({
    success,
    message,
    data,
    errors,
  });
};

export default sendJSON;
