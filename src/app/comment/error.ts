import { AppError } from "../../lib/error/error";

export const commentNotFound = new AppError("Comment not found", 404);
export const invalidCommentId = new AppError("Invalid comment ID", 400);
export const invalidParentComment = new AppError("Parent comment not found for this post", 404);
export const unauthorizedCommentAction = new AppError("You are not authorized to modify this comment", 403);
