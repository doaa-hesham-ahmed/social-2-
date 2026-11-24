import {Router} from "express";
import container from "../../lib/di/container";
import {TOKENS} from "../../lib/di/token";
import {AuthController} from "./controller/auth.controller";

const authController = container.resolve<AuthController>(TOKENS.AuthController)
export const authRouter = Router();

authRouter.post('/register',authController.register);
authRouter.post('/login',authController.login);
authRouter.post('/verifyAcount',authController.verifyAcount);
authRouter.post('/sendOtp',authController.sendOtp);
authRouter.post('/resetPassword',authController.resetPassword);
authRouter.post('/refreshToken',authController.refreshTokenFn);
authRouter.post('/loginWithGoogle',authController.loginWithGoogle);
authRouter.post('/enable2StepVerify',authController.enable2StepVerification);
authRouter.post('/verify2StepVerify',authController.verifyCodeActive2StepVerified);
