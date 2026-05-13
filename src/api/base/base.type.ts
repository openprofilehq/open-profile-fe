export type ApiResponse<TData> = {
  success: boolean;
  data: TData;
};

export type PaginatedApiResponse<TData> = {
  success: boolean;
  data: TData;
  meta: Record<string, unknown>;
};

export type ApiErrorDetail = { field: string; error: string };

export type ApiErrorType = {
  success: false;
  message: string;
  /**
   * This is the details of the error. Most likely due to validation errors.
   * It is an array of objects with the field and error properties.
   * The field is the field that caused the error.
   * The error is the error message.
   */
  details: ApiErrorDetail[];
};

export type ApiOptions = {
  signal?: AbortSignal;
};
