import { prisma } from "@repo/db/client";
import { WebSocket } from "ws";
import { scheduleBatchSave } from "./service";
import {
  addClientToRoom,
  addMessageToRoom,
  getRoomClients,
  isClientInRoom,
  removeClientFromRoom,
  store,
} from "./store";

import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";

export async function handleJoinRoom(
  ws: WebSocket,
  roomId: string,
  userId: string
) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Room not found",
      })
    );
    return;
  }

  const isAdmin = room.adminId === userId;

  const member = await prisma.roomMember.findUnique({
    where: {
      roomId_userId: {
        roomId,
        userId,
      },
    },
  });

  if (!isAdmin && !member) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "You are not a member of this room",
      })
    );
    return;
  }

  addClientToRoom(roomId, ws);

  const roomData = store.get(roomId);
  if (roomData && roomData.messages.length > 0) {
    ws.send(
      JSON.stringify({
        type: "pending_messages",
        messages: roomData.messages,
      })
    );
  }

  ws.send(
    JSON.stringify({
      type: "joined",
      roomId: roomId,
    })
  );
}

export function handleLeaveRoom(ws: WebSocket, roomId: string) {
  removeClientFromRoom(roomId, ws);
}

export function handleMessage(
  ws: WebSocket,
  roomId: string,
  userId: string,
  content: string
) {
  if (!isClientInRoom(roomId, ws)) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "You must join the room before sending messages",
      })
    );
    return;
  }

  const message = {
    id: crypto.randomUUID(),
    userId,
    content,
    timestamp: Date.now(),
    roomId: roomId,
  };

  addMessageToRoom(roomId, message);
  scheduleBatchSave();

  const clients = getRoomClients(roomId);
  if (clients) {
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "message", data: message }));
      }
    });
  }
}

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
