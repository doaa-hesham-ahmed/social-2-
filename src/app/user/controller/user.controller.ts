import { Request, Response, NextFunction } from "express";
import { UserService } from "../service/user.service";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../lib/di/token";

@injectable()
export class UserController {
      
    constructor(@inject(TOKENS.UserService) private readonly userService:UserService){

    }

    uploadProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.userService.uploadProfilePicture( req.file as Express.Multer.File,req.user?.id);
            res.json({
                message: "Profile picture Uploaded",
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };

    generatePresignedUrl = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { fileName, contentType } = req.body;

            const url = await this.userService.generatePresignedUrl(
                { mimetype: contentType, originalname: fileName } as Express.Multer.File,req.user?.id);

            res.json({
                message: "OK",
                success: true,
                data: url,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.userService.deletedProfilePicture(req.user?.id);

            res.json({
                message: "Profile picture deleted successfully",
                success: true,
            });
        } catch (error) {
            next(error);
        }
    };

    getProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const profilePicture = await this.userService.getProfilePicture(req.user?.id);

            res.json({
                message: "OK",
                success: true,
                data: profilePicture,
            });
        } catch (error) {
            next(error);
        }
    };
}
