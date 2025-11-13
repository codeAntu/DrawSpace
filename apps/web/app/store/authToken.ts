import { create } from "zustand";
import { setAuthToken } from "../query/exe";
import { LS } from "../utils/localStorage";

interface AuthTokenState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const TOKEN_KEY = "authToken";

export const useAuthToken = create<AuthTokenState>((set) => ({
  token: LS().getItem(TOKEN_KEY) || null,
  isAuthenticated: !!LS().getItem(TOKEN_KEY),
  setToken: (token) => {
    set({ token, isAuthenticated: !!token });
    if (token) {
      LS().setItem(TOKEN_KEY, token);
    } else {
      LS().removeItem(TOKEN_KEY);
    }
    setAuthToken(token || "");
  },
  logout: () => {
    set({ token: null, isAuthenticated: false });
    LS().removeItem(TOKEN_KEY);
    setAuthToken("");
  },
}));
