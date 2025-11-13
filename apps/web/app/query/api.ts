const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const Api = {
  baseURL: baseURL,
  login: `${baseURL}/api/login`,
  signup: `${baseURL}/api/signup`,
  logout: `${baseURL}/api/logout`,
  me: `${baseURL}/api/me`,
};
