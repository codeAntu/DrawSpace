import { WebSocketServer } from "ws";
import { checkUserToken } from "./helper";
import {
  addClientToRoom,
  addMessageToRoom,
  getRoomClients,
  isClientInRoom,
  removeClientFromRoom,
} from "./store";
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

  ws.on("message", function message(data) {
    const parsedData = JSON.parse(data.toString()) as MessageData;

    if (parsedData.type === "join_room") {
      const roomId = parsedData.roomId;
      if (!roomId) {
        ws.close(1008, "Room ID is required");
        return;
      }
      addClientToRoom(roomId, ws);
    }

    if (parsedData.type === "leave_room") {
      const roomId = parsedData.roomId;
      if (!roomId) {
        ws.close(1008, "Room ID is required");
        return;
      }
      removeClientFromRoom(roomId, ws);
    }

    if (parsedData.type === "message") {
      const roomId = parsedData.roomId;
      if (!roomId) {
        ws.close(1008, "Room ID is required");
        return;
      }

      // if (!isClientInRoom(roomId, ws)) {
      //   ws.send(
      //     JSON.stringify({
      //       type: "error",
      //       message: "You must join the room before sending messages",
      //     })
      //   );
      //   return;
      // }

      const content = parsedData.content;
      if (!content) {
        ws.close(1008, "Message content is required");
        return;
      }

      const message = {
        id: crypto.randomUUID(),
        userId,
        content,
        timestamp: Date.now(),
      };

      addMessageToRoom(roomId, message);

      const clients = getRoomClients(roomId);
      if (clients) {
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "message", data: message }));
          }
        });
      }
    }
  });

  // ws.on("error", console.error);

  // ws.send("something");
});
