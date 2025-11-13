import { useAuthToken } from "@/app/store/authToken";
import { postApi } from "..";
import { Api } from "../api";

interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export function loginApi(data: { email: string; password: string }) {
  return postApi<LoginResponse>(Api.login, data);
}

export function SignupApi(data: {
  email: string;
  name: string;
  password: string;
}) {
  return postApi<LoginResponse>(Api.signup, data);
}

export function logoutApi() {
  const logout = useAuthToken.getState().logout;
  logout();
}
