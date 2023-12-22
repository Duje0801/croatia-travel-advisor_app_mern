import { Response } from "express";

export const errorResponse = (
  message: string,
  res: Response,
  status: number
): Response => {
  return res.status(status).json({
    status: `fail`,
    error: `${message}`,
  });
};
