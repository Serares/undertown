import { Router, Request, Response, NextFunction } from "express";
import { RequestSessionType } from "../interfaces/RequestSessionType";
import * as authController from '../controllers/user';
import { RequestTokenPayload } from "../interfaces/RequestTokenPayload";

const router = Router();


/**
 * MVC routes
 */
router.get("/creare-cont", authController.getSignup);
router.get("/autentificare", authController.getLogin);
router.get("/resetare-parola/:resetToken", authController.getResetPassword);
router.get("/recuperare-parola", authController.getForgotPassword);
router.get("/adauga-proprietate", authController.getSubmitProperty);
//TODO profile page

/**
 * REST routes
 */
router.post("/user/signup", authController.postSignup);
router.post("/user/login", authController.postLogin);
router.post("/user/resetPassword", authController.postResetPassword);
router.post("/user/forgotPassword", authController.postForgotPassword);

export default router;
