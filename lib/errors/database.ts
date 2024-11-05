export class DatabaseConnectionError extends Error {
  constructor(message?: string) {
    super(message || "Database connection failed");
    this.name = "DatabaseConnectionError";
  }
}

export class DatabaseOperationError extends Error {
  constructor(operation: string, details?: string) {
    super(
      `Database operation '${operation}' failed${details ? `: ${details}` : ""}`,
    );
    this.name = "DatabaseOperationError";
  }
}
