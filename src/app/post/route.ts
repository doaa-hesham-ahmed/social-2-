import { Router } from "express";
import { authGuard } from "../../lib/auth/guard";
import container from "../../lib/di/container";
import { TOKENS } from "../../lib/di/token";
import { PostController } from "./controller/post.controller";

const postController = container.resolve<PostController>(TOKENS.PostController);
export const postRouter = Router();

postRouter.use(authGuard);

postRouter.post("/", postController.createPost);
postRouter.get("/", postController.getAllPosts);
postRouter.get("/:id", postController.getSinglePost);
postRouter.patch("/:id", postController.updatePost);
postRouter.delete("/:id", postController.deletePost);
