import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { getAuthUserId } from "../../../lib/auth/guard";
import { TOKENS } from "../../../lib/di/token";
import { validateBody } from "../../../lib/validation/validate";
import { createPostSchema, updatePostSchema } from "../dto/post.dto";
import { PostService } from "../service/post.service";

@injectable()
export class PostController {
    constructor(@inject(TOKENS.PostService) private readonly postService: PostService) {}

    createPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = getAuthUserId(req);
            const dto = validateBody(createPostSchema, req.body);
            const post = await this.postService.createPost(userId, dto);

            res.status(201).json({
                message: "Post created successfully",
                success: true,
                data: post,
            });
        } catch (error) {
            next(error);
        }
    };

    getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = getAuthUserId(req);
            const posts = await this.postService.getAllUserPosts(userId);

            res.status(200).json({
                message: "Posts retrieved successfully",
                success: true,
                data: posts,
            });
        } catch (error) {
            next(error);
        }
    };

    getSinglePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const post = await this.postService.getPostById(String(req.params.id));

            res.status(200).json({
                message: "Post retrieved successfully",
                success: true,
                data: post,
            });
        } catch (error) {
            next(error);
        }
    };

    updatePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = getAuthUserId(req);
            const dto = validateBody(updatePostSchema, req.body);
            const post = await this.postService.updatePost(String(req.params.id), userId, dto);

            res.status(200).json({
                message: "Post updated successfully",
                success: true,
                data: post,
            });
        } catch (error) {
            next(error);
        }
    };

    deletePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = getAuthUserId(req);
            await this.postService.deletePost(String(req.params.id), userId);

            res.status(200).json({
                message: "Post deleted successfully",
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };
}
