import { WebSocketServer } from "ws";
import {
  checkUserToken,
  handleJoinSpace,
  handleLeaveSpace,
  handleMessage,
} from "./helper";
import { MessageData } from "./types";

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
  const userId = token && checkUserToken(token);

  if (!userId) {
    ws.close(1008, "Invalid token");
    return;
  }

  ws.on("message", async function message(data) {
    const parsedData = JSON.parse(data.toString()) as MessageData;

    if (parsedData.type === "join_space") {
      const spaceId = parsedData.spaceId;
      if (!spaceId) {
        ws.close(1008, "Space ID is required");
        return;
      }
      await handleJoinSpace(ws, spaceId, userId);
    }

    if (parsedData.type === "leave_space") {
      const spaceId = parsedData.spaceId;
      if (!spaceId) {
        ws.close(1008, "Space ID is required");
        return;
      }
      handleLeaveSpace(ws, spaceId);
    }

    if (parsedData.type === "message") {
      const spaceId = parsedData.spaceId;
      const content = parsedData.content;

      if (!spaceId) {
        ws.close(1008, "Space ID is required");
        return;
      }

      if (!content) {
        ws.close(1008, "Message content is required");
        return;
      }

      handleMessage(ws, spaceId, userId, content);
    }
  });
});
