import {Request, Response, NextFunction} from "express";
import { RequestSessionType } from "../interfaces/RequestSessionType";

export function blockNotAuthenticatedAndNotAdmin(req: RequestSessionType, res: Response, next: NextFunction): void {
    //this middleware helps protect routes
    //in case a user that is not logged in types in browser ' /admin ' or ' /add-product'
    // the routs will simply not exist
    if (!req.session.isLoggedIn) {
        return res.redirect("/");
    }
    if (req.session.user.status !== "admin")
        return res.status(301).redirect("/");

    next();
}

export function blockAuthenticated(req: RequestSessionType, res: Response, next: NextFunction): void {
    if (req.session.isLoggedIn) {
        return res.redirect("/");
    }
    next();
}
