import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";

export function checkUserToken(token: string): string | null {
  try {
    const decodeToken = jwt.verify(token, JWT_SECRET);

    if (
      !decodeToken ||
      typeof decodeToken !== "object" ||
      !("userId" in decodeToken)
    ) {
      return null;
    }

    return decodeToken.userId;
  } catch (error) {
    return null;
  }
}
