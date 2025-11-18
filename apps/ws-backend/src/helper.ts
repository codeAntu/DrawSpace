import { prisma } from "@repo/db/client";
import { WebSocket } from "ws";
import { scheduleBatchSave } from "./service";
import {
  addClientToSpace,
  addMessageToSpace,
  getSpaceClients,
  isClientInSpace,
  removeClientFromSpace,
  store,
} from "./store";

import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";

export async function handleJoinSpace(
  ws: WebSocket,
  spaceId: string,
  userId: string
) {
  const space = await prisma.space.findUnique({
    where: { id: spaceId },
  });

  if (!space) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Space not found",
      })
    );
    return;
  }

  const isAdmin = space.adminId === userId;

  const member = await prisma.spaceMember.findUnique({
    where: {
      spaceId_userId: {
        spaceId,
        userId,
      },
    },
  });

  if (!isAdmin && !member) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "You are not a member of this space",
      })
    );
    return;
  }

  addClientToSpace(spaceId, ws);

  const spaceData = store.get(spaceId);
  if (spaceData && spaceData.messages.length > 0) {
    ws.send(
      JSON.stringify({
        type: "pending_messages",
        messages: spaceData.messages,
      })
    );
  }

  ws.send(
    JSON.stringify({
      type: "joined",
      spaceId: spaceId,
    })
  );
}

export function handleLeaveSpace(ws: WebSocket, spaceId: string) {
  removeClientFromSpace(spaceId, ws);
}

export function handleMessage(
  ws: WebSocket,
  spaceId: string,
  userId: string,
  content: string
) {
  if (!isClientInSpace(spaceId, ws)) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "You must join the space before sending messages",
      })
    );
    return;
  }

  const message = {
    id: crypto.randomUUID(),
    userId,
    content,
    timestamp: Date.now(),
    spaceId: spaceId,
  };

  addMessageToSpace(spaceId, message);
  scheduleBatchSave();

  const clients = getSpaceClients(spaceId);
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
