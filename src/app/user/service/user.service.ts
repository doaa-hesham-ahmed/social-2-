import {ICloudProvider} from "../../../pkg/cloud/cloud.interface";
import { UserRepository } from "../repository/user.repository";
import { AppError } from "../../../lib/error/error";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../lib/di/token";
@injectable()
export class UserService{

    constructor(@inject(TOKENS.UserRepository) private readonly userRepository:UserRepository,
                @inject(TOKENS.CloudProvider) private readonly cloudProvider:ICloudProvider
   ){

    }
    uploadProfilePicture=async (file:Express.Multer.File,userId:string)=>{
       const key = await this.cloudProvider.uploadFile(file ,`users ${userId}`);
       await this.userRepository.update({_id:userId},{profilePicturePath:key});
       return key;
    }
    generatePresignedUrl=async (file:Partial<Express.Multer.File>,userId:string)=>{
       return await this.cloudProvider.generatePresignedUrl(file ,`users ${userId}`);
    }

    deletedProfilePicture = async (userId: string) => {
    const user = await this.userRepository.findById(userId);
    if (!user?.profilePicturePath) throw new AppError("Profile picture not found", 404);
    await this.cloudProvider.deleteFile(user.profilePicturePath);

    await this.userRepository.update({ _id: userId },{profilePicturePath:null });
   };
   
   getProfilePicture = async (userId: string) => {
    const user = await this.userRepository.findById(userId);
    if (!user?.profilePicturePath) throw new AppError("Profile picture not found", 404);
    return user.profilePicturePath;
};
}