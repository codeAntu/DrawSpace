import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

interface DecodedToken {
  userId: string;
  iat: number;
}

export function middleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ error: "No token provided" });
  }

  console.log("Verifying token:", token);

  try {
    const decodeToken = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (!decodeToken) {
      return res.status(401).send({ error: "Invalid token" });
    }

    req.userId = decodeToken.userId;
    next();
  } catch (error) {
    return res.status(401).send({ error: "Invalid or expired token" });
  }
}
