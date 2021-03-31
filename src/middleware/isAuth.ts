import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../utils/secrets';


export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const reqHeader = req.headers["authorization"];

    if (typeof reqHeader !== "undefined") {
        const token = reqHeader.split(" ")[1];
        jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.sendStatus(401);
            }
            // Add the decoded payload to request.user
            //@ts-ignore
            req.user = decoded.user;
            next();
        })
    } else {
        res.sendStatus(401);
    }

}
