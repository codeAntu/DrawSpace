import { create } from "zustand";

interface AuthTokenState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthToken = create<AuthTokenState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: null }),
}));
