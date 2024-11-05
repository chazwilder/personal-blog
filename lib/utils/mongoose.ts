import { DatabaseOperationError } from "../errors/database";
import { Model } from "mongoose";

export async function safeMongooseOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(`MongoDB operation failed: ${operationName}`, error);
    throw new DatabaseOperationError(
      operationName,
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}

export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");
      console.warn(
        `Attempt ${attempt} failed. ${
          attempt < maxRetries ? "Retrying..." : "Max retries reached."
        }`,
      );

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError;
}

export type MongooseOperationResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function withErrorHandling<T>(
  model: Model<any>,
  operation: string,
  callback: () => Promise<T>,
): Promise<MongooseOperationResult<T>> {
  try {
    const data = await callback();
    return { success: true, data };
  } catch (error) {
    console.error(`Error in ${model.modelName} ${operation}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
