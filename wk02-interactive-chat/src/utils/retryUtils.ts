import { error } from "console";

// Utility functions for retrying failed requests
export class RetryUtils {
  // Exponential backoff retry mechanism
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if ((error as any).status === 401) {
          throw error;
        }
        //Last Attempt throw error
        if (attempt === maxRetries) {
          throw error;
        }

        //Calculate delay with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms`);

        //Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));

      }
    }

    throw new Error("Max retries exceeded");
  }
}
