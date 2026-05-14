import { ApiError } from "@/api/base/base.error";
import { ApiResponse } from "@/api/base/base.type";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: "/api/proxy",
  timeout: 60 * 1000,
});

function getApiErrorMessage(message?: unknown): string {
  if (typeof message === "string") return message;
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
        e.response?.data?.message
      );
    }

    throw new ApiError(
      "Something went wrong while processing your request, please try again later!"
    );
  }
}
