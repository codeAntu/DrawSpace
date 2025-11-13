import { postApi } from "..";
import { Api } from "../api";

export function loginApi(data: { email: string; password: string }) {
  return postApi(Api.login, data);
}
