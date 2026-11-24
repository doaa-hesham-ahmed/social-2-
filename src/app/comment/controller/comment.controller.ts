import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { getAuthUserId } from "../../../lib/auth/guard";
import { TOKENS } from "../../../lib/di/token";
import { validateBody } from "../../../lib/validation/validate";
import { createCommentSchema, updateCommentSchema } from "../dto/comment.dto";
import { CommentService } from "../service/comment.service";

@injectable()
export class CommentController {
    constructor(@inject(TOKENS.CommentService) private readonly commentService: CommentService) {}

    createComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = getAuthUserId(req);
            const dto = validateBody(createCommentSchema, req.body);
            const comment = await this.commentService.createComment(String(req.params.postId), userId, dto);

            res.status(201).json({
                message: "Comment created successfully",
                success: true,
                data: comment,
            });
        } catch (error) {
            next(error);
        }
    };

    getPostComments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comments = await this.commentService.getPostComments(String(req.params.postId));

            res.status(200).json({
                message: "Comments retrieved successfully",
                success: true,
                data: comments,
            });
        } catch (error) {
            next(error);
        }
    };

    getSingleComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comment = await this.commentService.getCommentById(String(req.params.id));

            res.status(200).json({
                message: "Comment retrieved successfully",
                success: true,
                data: comment,
            });
        } catch (error) {
            next(error);
        }
    };

    updateComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = getAuthUserId(req);
            const dto = validateBody(updateCommentSchema, req.body);
            const comment = await this.commentService.updateComment(String(req.params.id), userId, dto);

            res.status(200).json({
                message: "Comment updated successfully",
                success: true,
                data: comment,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = getAuthUserId(req);
            await this.commentService.deleteComment(String(req.params.id), userId);

            res.status(200).json({
                message: "Comment deleted successfully",
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };
}
