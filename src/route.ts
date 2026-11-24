import {Router} from 'express';
import {authRouter} from "./app/auth/route";
import {postRouter} from "./app/post/route";
import {commentRouter} from "./app/comment/route";

export const router = Router();

router.use('/auth', authRouter);
// router.use ('/user',);
router.use('/comment', commentRouter);
router.use('/post', postRouter);