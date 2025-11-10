import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

function checkUserToken(token: string): string | null {
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

interface MessageData {
  type: string;
  roomId?: string;
  content?: string;
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;

  console.log("url", url);

  if (!url) {
    ws.close(1008, "URL is required");
    return;
  }

  const queryString = url.includes("?") ? url.split("?")[1] : url.substring(1);
  const queryParams = new URLSearchParams(queryString);
  const token = queryParams.get("token");
  const userId = token && checkUserToken(token);

  if (!userId) {
    ws.close(1008, "Invalid token");
    return;
  }

  ws.on("message", function message(data) {
    const parsedData = JSON.parse(data.toString()) as MessageData;

    if (parsedData.type === "join_room") {
      // join room logic
    }

    if (parsedData.type === "leave_room") {
      // leave room logic
    }

    if (parsedData.type === "message") {
      // message handling logic
    }
  });

  // ws.on("error", console.error);

  // ws.send("something");
});
