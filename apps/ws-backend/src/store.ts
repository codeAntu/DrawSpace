import { WebSocket } from "ws";

export interface StoredMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
}

export interface RoomData {
  clients: Set<WebSocket>;
  messages: StoredMessage[];
}

// Map: roomId -> { clients, messages }
export const store = new Map<string, RoomData>();

// Helper functions
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
    // Optional: Clean up empty rooms
    if (room.clients.size === 0) {
      store.delete(roomId);
    }
  }
}

export function addMessageToRoom(roomId: string, message: StoredMessage): void {
  const room = store.get(roomId);
  if (room) {
    room.messages.push(message);
    // Keep only last 100 messages in memory
    if (room.messages.length > 100) {
      room.messages.shift();
    }
  }
}

export function getRecentMessages(roomId: string): StoredMessage[] {
  const room = store.get(roomId);
  return room ? room.messages : [];
}

export function getRoomClients(roomId: string): Set<WebSocket> | undefined {
  return store.get(roomId)?.clients;
}

export function isClientInRoom(roomId: string, client: WebSocket): boolean {
  const room = store.get(roomId);
  return room ? room.clients.has(client) : false;
}
