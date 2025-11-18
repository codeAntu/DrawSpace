const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export function api(strings: TemplateStringsArray, ...values: unknown[]) {
  let result = strings[0] || "";
  for (let i = 0; i < values.length; i++) {
    result += String(values[i]) + (strings[i + 1] || "");
  }
  return BACKEND_URL + result;
}

export const Api = {
  baseURL: BACKEND_URL,
  login: api`/login`,
  signup: api`/signup`,
  logout: api`/logout`,
  me: api`/me`,
  space: api`/space`,
  mySpaces: api`/spaces`,
};
