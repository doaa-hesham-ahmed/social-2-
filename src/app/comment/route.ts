import { Router } from "express";
import { authGuard } from "../../lib/auth/guard";
import container from "../../lib/di/container";
import { TOKENS } from "../../lib/di/token";
import { CommentController } from "./controller/comment.controller";

const commentController = container.resolve<CommentController>(TOKENS.CommentController);
export const commentRouter = Router();

commentRouter.use(authGuard);

commentRouter.post("/post/:postId", commentController.createComment);
commentRouter.get("/post/:postId", commentController.getPostComments);
commentRouter.get("/:id", commentController.getSingleComment);
commentRouter.patch("/:id", commentController.updateComment);
commentRouter.delete("/:id", commentController.deleteComment);
