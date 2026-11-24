import { AppError } from "../../lib/error/error";

export const postNotFound = new AppError("Post not found", 404);
export const invalidPostId = new AppError("Invalid post ID", 400);
export const unauthorizedPostAction = new AppError("You are not authorized to modify this post", 403);
export const commentsDisabled = new AppError("Comments are disabled for this post", 403);
