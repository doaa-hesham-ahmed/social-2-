import { z } from "zod";

export const createPostSchema = z.object({
    content: z.string().trim().min(1, "Content cannot be empty").max(200, "Content must be at most 200 characters"),
    allowsComments: z.boolean().optional(),
});

export const updatePostSchema = z
    .object({
        content: z.string().trim().min(1, "Content cannot be empty").max(200, "Content must be at most 200 characters").optional(),
        allowsComments: z.boolean().optional(),
    })
    .refine((data) => data.content !== undefined || data.allowsComments !== undefined, {
        message: "At least one field (content or allowsComments) must be provided",
    });

export type CreatePostDto = z.infer<typeof createPostSchema>;
export type UpdatePostDto = z.infer<typeof updatePostSchema>;
