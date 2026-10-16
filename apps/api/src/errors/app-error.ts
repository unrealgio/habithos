export type ErrorCode =
  "INVALID_JSON" | "VALIDATION_ERROR" | "NOT_FOUND" | "EMAIL_TAKEN" | "INTERNAL_ERROR";

export type FieldErrors = Record<string, string[] | undefined>;

export type ErrorResponse = {
  error: {
    code: ErrorCode;
    message: string;
    fieldErrors?: FieldErrors;
  };
};

export class AppError extends Error {
  statusCode: number;
  code: ErrorCode;
  fieldErrors?: FieldErrors;

  constructor(statusCode: number, code: ErrorCode, message: string, fieldErrors?: FieldErrors) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}
