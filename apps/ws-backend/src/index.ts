import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws, request) {
  const url = request.url;

  if (!url) {
    ws.close(1008, "URL is required");
    return;
  }

  const queryString = url.includes("?") ? url.split("?")[1] : url.substring(1);
  const queryParams = new URLSearchParams(queryString);
  const token = queryParams.get("token");

  if (!token) {
    ws.close(1008, "Token is required");
    return;
  }

  let userId: string;

  try {
    const decodeToken = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };

    if (!decodeToken.userId) {
      ws.close(1008, "Invalid token: userId missing");
      return;
    }

    userId = decodeToken.userId;
  } catch (error) {
    ws.close(1008, "Invalid token");
    return;
  }

  // Now you have the authenticated userId available for this connection
  console.log(`User ${userId} connected`);

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.send("something");
});
