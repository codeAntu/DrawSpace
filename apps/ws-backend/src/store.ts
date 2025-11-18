import { WebSocket } from "ws";

export interface StoredMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
  spaceId: string;
}

export interface SpaceData {
  clients: Set<WebSocket>;
  messages: StoredMessage[];
}

export const store = new Map<string, SpaceData>();

export function addClientToSpace(spaceId: string, client: WebSocket): void {
  if (!store.has(spaceId)) {
    store.set(spaceId, { clients: new Set(), messages: [] });
  }
  store.get(spaceId)!.clients.add(client);
}

export function removeClientFromSpace(
  spaceId: string,
  client: WebSocket
): void {
  const space = store.get(spaceId);
  if (space) {
    space.clients.delete(client);
    if (space.clients.size === 0) {
      store.delete(spaceId);
    }
  }
}

export function addMessageToSpace(
  spaceId: string,
  message: StoredMessage
): void {
  const space = store.get(spaceId);
  if (space) {
    space.messages.push(message);
  }
}

export function getSpaceClients(spaceId: string): Set<WebSocket> | undefined {
  return store.get(spaceId)?.clients;
}

export function isClientInSpace(spaceId: string, client: WebSocket): boolean {
  const space = store.get(spaceId);
  return space ? space.clients.has(client) : false;
}

export function getAllPendingMessages(): StoredMessage[] {
  const allMessages: StoredMessage[] = [];
  store.forEach((space) => {
    allMessages.push(...space.messages);
  });
  return allMessages;
}

export function clearSpaceMessages(spaceId: string): void {
  const space = store.get(spaceId);
  if (space) {
    space.messages = [];
    if (space.clients.size === 0) {
      store.delete(spaceId);
    }
  }
}
