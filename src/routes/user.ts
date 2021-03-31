import { Router, Request, Response, NextFunction } from "express";
import { RequestSessionType } from "../interfaces/RequestSessionType";
import * as authController from '../controllers/user';
import passport from 'passport';
import { isAuth } from "../middleware/isAuth";

const router = Router();

/**
 * MVC routes
 */
router.get("/creare-cont", authController.getSignup);
router.get("/autentificare", authController.getLogin);
//TODO
/**
 * reset routes
 */

/**
 * REST routes
 */
router.post("/signup", passport.authenticate("signup", {session: false}), authController.postSignup);
router.post("/login", authController.postLogin);


/**
 * secure route
 */
 router.get("/adauga-proprietate", isAuth, (req, res, next) => {
    console.log("request", req);
    res.json({
        message: "Secure route",
        user: req.user
    })
});


export default router;