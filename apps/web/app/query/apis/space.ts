import { getApi, postApi } from "..";
import { Api } from "../api";

interface SpaceResponse {
  space: Space;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photo: string | null;
}

export interface SpaceMember {
  user: User;
}

export interface Space {
  id: string;
  name: string;
  adminId: string;
  createdAt: string;
  updatedAt: string;
  admin: User;
  members: SpaceMember[];
}

interface ApiSpacesResponse {
  spaces: Space[];
}

export function createSpace(data: { name: string }) {
  return postApi<SpaceResponse>(Api.space, data);
}

export function getSpace(data: { spaceId: string }) {
  return postApi<SpaceResponse>(Api.space, data);
}

export function getMySpaces() {
  return getApi<ApiSpacesResponse>(Api.mySpaces);
}
