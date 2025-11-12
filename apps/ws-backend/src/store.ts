import { WebSocket } from "ws";

export interface StoredMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
  roomId: string;
}

export interface RoomData {
  clients: Set<WebSocket>;
  messages: StoredMessage[];
}

export const store = new Map<string, RoomData>();

export function addClientToRoom(roomId: string, client: WebSocket): void {
  if (!store.has(roomId)) {
    store.set(roomId, { clients: new Set(), messages: [] });
  }
  store.get(roomId)!.clients.add(client);
}

export function removeClientFromRoom(roomId: string, client: WebSocket): void {
  const room = store.get(roomId);
  if (room) {
    room.clients.delete(client);
    if (room.clients.size === 0) {
    }
  }
}

export function addMessageToRoom(roomId: string, message: StoredMessage): void {
  const room = store.get(roomId);
  if (room) {
    room.messages.push(message);
  }
}

export function getRoomClients(roomId: string): Set<WebSocket> | undefined {
  return store.get(roomId)?.clients;
}

export function isClientInRoom(roomId: string, client: WebSocket): boolean {
  const room = store.get(roomId);
  return room ? room.clients.has(client) : false;
}

export function getAllPendingMessages(): StoredMessage[] {
  const allMessages: StoredMessage[] = [];
  store.forEach((room) => {
    allMessages.push(...room.messages);
  });
  return allMessages;
}

export function clearRoomMessages(roomId: string): void {
  const room = store.get(roomId);
  if (room) {
    room.messages = [];
    if (room.clients.size === 0) {
      store.delete(roomId);
    }
  }
}
