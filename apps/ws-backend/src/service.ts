import { prisma } from "@repo/db/client";
import { getAllPendingMessages, store } from "./store";

let saveTimeout: NodeJS.Timeout | null = null;

export async function scheduleBatchSave() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(async () => {
    const pendingMessages = getAllPendingMessages();

    if (pendingMessages.length === 0) {
      return;
    }

    try {
      await prisma.chat.createMany({
        data: pendingMessages.map((msg) => ({
          roomId: msg.roomId,
          userId: msg.userId,
          message: msg.content,
        })),
      });

      store.forEach((room) => {
        room.messages = [];
        if (room.clients.size === 0) {
          store.delete(room as any);
        }
      });
    } catch (error) {}

    saveTimeout = null;
  }, 5000);
}
