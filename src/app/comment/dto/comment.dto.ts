import { z } from "zod";

export const createCommentSchema = z.object({
    content: z.string().trim().min(1, "Content cannot be empty").max(200, "Content must be at most 200 characters"),
    parentId: z.string().trim().optional(),
});

export const updateCommentSchema = z.object({
    content: z.string().trim().min(1, "Content cannot be empty").max(200, "Content must be at most 200 characters"),
});

export type CreateCommentDto = z.infer<typeof createCommentSchema>;
export type UpdateCommentDto = z.infer<typeof updateCommentSchema>;
