import axios from "axios";
import { useAuthToken } from "../store/authToken";

// Call this after login or whenever the token changes in Zustand
export function setAuthToken(t?: string) {
  const token = useAuthToken.getState().token || t;
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
}

axios.defaults.validateStatus = function () {
  return true;
};

export default function exe() {
  setAuthToken();
}
