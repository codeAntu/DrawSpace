import axios from "axios";
import { create } from "zustand";
import { Api } from "../query/api";
import { useAuthToken } from "./authToken";

export interface User {
  id: string;
  email: string;
  name: string | null;
  photo: string | null;
}

interface AuthUserState {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

export const useAuthUser = create<AuthUserState>((set, get) => ({
  user: null,
  loading: false,
  fetchUser: async () => {
    const token = useAuthToken.getState().token;
    set({ loading: true });
    if (!token) {
      set({ user: null, loading: false });
      return;
    }
    try {
      const response = await axios.get(Api.me, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: response.data.user, loading: false });
    } catch (error) {
      set({ user: null, loading: false });
      // Optionally log error
    }
  },
  clearUser: () => set({ user: null }),
}));
