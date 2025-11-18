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
          spaceId: msg.spaceId,
          userId: msg.userId,
          message: msg.content,
        })),
      });

      store.forEach((space) => {
        space.messages = [];
        if (space.clients.size === 0) {
          store.delete(space as any);
        }
      });
    } catch (error) {}

    saveTimeout = null;
  }, 5000);
}
