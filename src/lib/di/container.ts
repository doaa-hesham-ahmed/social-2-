import { container} from "tsyringe";
import{ UserService } from "../../app/user/service/user.service";
import { TOKENS } from "./token";
import { PostService } from "../../app/post/service/post.service";
import { CommentService } from "../../app/comment/service/comment.service";
import { UserController } from "../../app/user/controller/user.controller";
import { PostController } from "../../app/post/controller/post.controller";
import { CommentController } from "../../app/comment/controller/comment.controller";
import { UserRepository } from '../../app/user/repository/user.repository';
import { PostRepository } from "../../app/post/repository/post.repository";
import { CommentRepository } from "../../app/comment/repository/comment.repository";
import { s3CloudProvider } from "../cloud/init";
import { cacheProvider } from "../cache/init";
import { mailjetProvider, nodemailerProvider } from "../email/init";
import {AuthService} from "../../app/auth/service/auth.service";
import {AuthRepository} from "../../app/auth/repository/auth.repository";
import {AuthController} from "../../app/auth/controller/auth.controller";

//service
container.registerSingleton(TOKENS.UserService,UserService);
container.registerSingleton(TOKENS.PostService,PostService);
container.registerSingleton(TOKENS.CommentService,CommentService);
container.registerSingleton(TOKENS.AuthService,AuthService);



//controller
container.registerSingleton(TOKENS.UserController,UserController);
container.registerSingleton(TOKENS.PostController,PostController);
container.registerSingleton(TOKENS.CommentController,CommentController);
container.registerSingleton(TOKENS.AuthController,AuthController);


//repository
container.registerSingleton(TOKENS.UserRepository,UserRepository);
container.registerSingleton(TOKENS.PostRepository,PostRepository);
container.registerSingleton(TOKENS.CommentRepository,CommentRepository);
container.registerSingleton(TOKENS.AurhRepository,AuthRepository);

//utils
container.registerInstance(TOKENS.CloudProvider,s3CloudProvider);
container.registerInstance(TOKENS.CacheProvider,cacheProvider);
container.registerInstance(TOKENS.NodeMailerProvider,nodemailerProvider);
container.registerInstance(TOKENS.MailjetProvider,mailjetProvider);
// container.registerInstance(TOKENS.FirebaseProvider,fir);

export default container;