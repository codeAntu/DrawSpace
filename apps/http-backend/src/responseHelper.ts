import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string | null;
  data?: T;
}

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
) {
  const response: ApiResponse<T> = {
    success: true,
    message: message || "Success",
    error: null,
    ...(data && { ...data }),
  };
  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  error: string,
  message?: string,
  statusCode: number = 500
) {
  const response: ApiResponse = {
    success: false,
    message: message || "An error occurred",
    error,
  };
  return res.status(statusCode).json(response);
}
