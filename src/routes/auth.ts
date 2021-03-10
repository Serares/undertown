/*
import { Router, Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/auth";
// this is the middleware that helps with validation
import { check, body } from "express-validator/check";
import { User } from "../models/user";
import { blockAuthenticated } from "../middleware/isAuth";
import { RequestSessionType } from "../interfaces/RequestSessionType";

export class AuthRouter {
    // TODO try to create a Interface or Abstract class for Router classes
    private _router: Router = Router();
    private controller: AuthController = new AuthController();

    constructor() {
        this.config();
        this.initializeRoutes();
    }

    get router(): Router {
        return this._router;
    }

    private initializeRoutes(): void {
        this._router.route("/login")
            .get(this.blockIfAuthenticated, this.controller.getLogin)
            // TODO create private methods for validation middleware
            .post([body("email")
                .isEmail()
                .withMessage("Please enter a valid email address.")
                .custom((value, { req: Request }) => {
                    return User.findOne({ email: value })
                        .then(userDoc => {
                            if (!userDoc) {
                                return Promise.reject("Can't find this email");
                            }
                        });
                }),
            body("password", "Invalid password")
                .isLength({ min: 5 })
                .isLength({ min: 5 })
                .isAlphanumeric()
                .trim()
            ], (req: RequestSessionType | any, res: Response, next: NextFunction) => {
                this.controller.postLogin(req, res, next);
            });

        this._router.post("/logout", (req: RequestSessionType | any, res: Response, next: NextFunction) => {
            this.controller.adminLogout(req, res, next);
        });

        this._router.delete("/logout", (req: RequestSessionType | any, res: Response, next: NextFunction) => {
            this.controller.basicLogout(req, res, next);
        });

        this._router.get("/signup", this.blockIfAuthenticated, this.controller.getSignup);

        this._router.post("/signup", [
            //you can add the checks in an array
            check("email")
                .isLength({ min: 5 })
                .withMessage("Please enter a valid email.")
                .custom((value, { req }) => {

                    return User.findOne({ email: value })
                        .then(userDocument => {
                            if (userDocument) {
                                return Promise.reject("Email already exists");
                            }
                        });
                }),
            body("phoneNumber", "Număr invalid")
                .optional()
                .trim()
                .isLength({ min: 10 })
                .isNumeric(),
            //body checks only in the body of the request
            body(
                "password",
                //adding this message as a default .withMessage
                "Please enter a password with only numbers and text and at least 5 characters."
            )
                .isLength({ min: 5 })
                .isAlphanumeric()
                .trim(),
            body("confirmPassword")
                .trim()
                .custom((value, { req }) => {
                    if (value !== req.body.password) {
                        throw new Error("Passwords have to match!");
                    }
                    return true;
                })
        ], this.controller.postSignup);
    }

    private blockIfAuthenticated(req: RequestSessionType | any, res: Response, next: NextFunction): void {
        blockAuthenticated(req, res, next);
    }
}
*/