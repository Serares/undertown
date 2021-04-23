import { Router, Request, Response, NextFunction } from "express";
import { RequestSessionType } from "../interfaces/RequestSessionType";
import * as authController from '../controllers/user';
import { isAuth } from "../middleware/isAuth";
import { RequestTokenPayload } from "../interfaces/RequestTokenPayload";
import { uploadMulter, sendUploadToGCS } from '../middleware/gcsStorage';

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
router.post("/user/submitProperty", authController.postSubmitProperty);
router.post("/user/resetPassword", authController.postResetPassword);
router.post("/user/forgotPassword", authController.postForgotPassword);
router.post("/adauga-proprietate",isAuth, uploadMulter.array("images", 20), sendUploadToGCS, authController.postSubmitProperty);

router.get("/profil", isAuth, (req, res, next) => {
    console.log("request", req);
    res.json({
        message: "Secure route",
        user: req.user
    })
});


export default router;
