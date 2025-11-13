import axios, { AxiosRequestConfig } from "axios";
import exe from "./exe";

exe();

const DEFAULT_ERR = "Something went wrong. Please try again later.";

export interface ServerResponse {
  message?: string;
  isAlert?: boolean;
  statusCode?: number;
  error?: string;
  success?: boolean;
}

async function apiRequest<T>(
  method: AxiosRequestConfig["method"],
  path: string,
  data?: unknown,
  config?: AxiosRequestConfig
) {
  try {
    let response;
    switch (method) {
      case "get":
        response = await axios.get<T & ServerResponse>(path, config);
        break;
      case "post":
        response = await axios.post<T & ServerResponse>(path, data, config);
        break;
      case "put":
        response = await axios.put<T & ServerResponse>(path, data, config);
        break;
      case "delete":
        response = await axios.delete<T & ServerResponse>(path, config);
        break;
      default:
        response = await axios.get<T & ServerResponse>(path, config);
        break;
    }
    // return { data: response.data, headers: response.headers }
    return response.data;
  } catch (error: unknown) {
    // return { data: handleError(error) as T & ServerResponse }
    return handleError(error) as T & ServerResponse;
  }
}

export async function postApi<T>(
  path: string,
  data?: unknown,
  config?: AxiosRequestConfig
) {
  return apiRequest<T>("post", path, data, config);
}

export async function getApi<T>(
  path: string,
  data?: unknown,
  config?: AxiosRequestConfig
) {
  return apiRequest<T>("get", path, data, config);
}

export async function putApi<T>(
  path: string,
  data?: unknown,
  config?: AxiosRequestConfig
) {
  return apiRequest<T>("put", path, data, config);
}

export async function deleteApi<T>(path: string, config?: AxiosRequestConfig) {
  return apiRequest<T>("delete", path, undefined, config);
}

export async function patchApi<T>(path: string, config?: AxiosRequestConfig) {
  return apiRequest<T>("patch", path, undefined, config);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(error: any) {
  // Network error
  if (!error?.response) {
    handleNetworkError();
    console.log(error);
    return { message: DEFAULT_ERR, isAlert: true };
  }

  switch (error?.response?.status) {
    // case 401:
    //   handleUnauthenticated()
    //   return { message: error.response.data.message, isAlert: true }
    case 400:
      return {
        message: error.response.data.message,
        statusCode: 400,
        isAlert: true,
      };
    default:
      // return {
      //   message: 'Internal Server Error. Please try again later.',
      //   statusCode: error.response.status || 500,
      //   isAlert: true,
      //   error: error.response.data.error,
      // }
      throw new Error("Something went wrong. ");
  }
}

function handleNetworkError() {}

// function handleUnauthenticated() {
//   console.log('Unauthenticated', 'Logging out')
//   // logout()
// }
