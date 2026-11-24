import { z } from "zod";
import { Types } from "mongoose";
import { AppError } from "../error/error";

/**
 * Validates a request body against a Zod schema and returns typed data.
 */
export function validateBody<T>(schema: z.ZodType<T>, body: unknown): T {
    const result = schema.safeParse(body);

    if (!result.success) {
        const errMessages = result.error.issues.map((issue) => {
            const field = issue.path.length > 0 ? issue.path.join(".") : "body";
            return `${field}: ${issue.message}`;
        });
        throw new AppError(errMessages.join(", "), 400);
    }

    return result.data;
}

/**
 * Ensures the given string is a valid MongoDB ObjectId.
 */
export function assertValidObjectId(id: string, error: AppError): void {
    if (!Types.ObjectId.isValid(id)) {
        throw error;
    }
}
