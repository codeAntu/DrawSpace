import { postApi } from "..";
import { Api } from "../api";

interface RoomResponse {
  room: Room;
}

export interface Room {
  id: string;
  name: string;
  adminId: string;
}

export function createRoom(data: { name: string }) {
  return postApi<RoomResponse>(Api.room, data);
}
