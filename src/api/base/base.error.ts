import { ApiErrorDetail } from "@/api/base/base.type";

export class ApiError extends Error {
  public details: ApiErrorDetail[];
  constructor(message: string, details?: ApiErrorDetail[]) {
    super(message);
    this.details = Array.isArray(details) ? details : [];
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
