import {Router} from "express";
import { uploadSingleFile} from "../../lib/media/multer";
import container from '../../lib/di/container';
import { TOKENS } from "../../lib/di/token";
import { UserController } from "./controller/user.controller";

const userController:UserController = container.resolve(TOKENS.UserController)

export const userRouter = Router();

userRouter.post('/upload-profile-pic',uploadSingleFile('pp'),userController.uploadProfilePicture);
userRouter.post('/get-presigned-url',userController.generatePresignedUrl);
userRouter.delete('/delete-profile-pic',userController.deleteProfilePicture);
userRouter.get('/get-profile-pic',userController.getProfilePicture);