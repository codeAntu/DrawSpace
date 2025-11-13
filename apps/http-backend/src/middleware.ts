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
  // Try to get token from Authorization header first, then from cookie
  const authHeader = req.headers.authorization?.split(" ")[1];
  const cookieToken = req.cookies?.auth_token;
  const token = authHeader || cookieToken;

  if (!token) {
    return res.status(401).send({ error: "No token provided" });
  }

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
