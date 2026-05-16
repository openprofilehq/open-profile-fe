import { ApiError } from "@/api/base/base.error";
import { ApiResponse } from "@/api/base/base.type";
import { env } from "@/env/client";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: `${env.NEXT_PUBLIC_API_URL}/api/v1`,
  timeout: 60 * 1000,
  withCredentials: true,
});

// track if we're already refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(null);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // don't refresh if the failing request IS the refresh or login endpoint
    if (
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/me")
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      originalRequest._retry = true;
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post("/auth/refresh-token");
      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      // reject and let the layout handle redirects
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

function getApiErrorMessage(message?: unknown): string {
  if (typeof message === "string") return message;

  // IF THIS ERROR HAPPENS, IT IS MOST LIKELY DUE TO VALIDATION ERRORS. THE MESSAGE CAN BE REFINED TILL IT IS RIGHT FOR THE USER.
  return "An error occurred. Please check your input and try again.";
}

export async function callApi<TResData>({
  url,
  method = "GET",
  data,
  params,
  headers,
  signal,
}: {
  url: `/${string}`;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: AxiosRequestConfig["headers"];
  signal?: AbortSignal;
}) {
  try {
    const response = await api.request<ApiResponse<TResData>>({
      url,
      method,
      data,
      params,
      headers: {
        "Content-Type":
          data instanceof FormData ? "multipart/form-data" : "application/json",
        ...headers,
      },
      signal,
    });

    return (response.data.data ?? response.data) as TResData;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new ApiError(
        e.response ? getApiErrorMessage(e.response.data?.message) : e.message,
        e.response?.data?.message,
        e.response?.status
      );
    }

    throw new ApiError(
      "Something went wrong while processing your request, please try again later!"
    );
  }
}
