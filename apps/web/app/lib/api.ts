const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const Api = {
  baseURL: baseURL,
  login: `${baseURL}/api/auth/login`,
  signup: `${baseURL}/api/auth/signup`,
  logout: `${baseURL}/api/auth/logout`,
  me: `${baseURL}/api/auth/me`,
};



