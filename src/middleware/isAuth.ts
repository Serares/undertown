import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { UserTokenPayload } from "../interfaces/UserTokenPayload";
import logger, { timeNow } from "../utils/logger";
import { TOKEN_SECRET } from '../utils/secrets';

//TODO move auth to db_api
export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const reqHeader = req.headers["authorization"];

    if (typeof reqHeader !== "undefined") {
        const token = reqHeader.split(" ")[1];
        jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
            if (err) {
                logger.debug("Error decoding jwt --> function isAuth " + timeNow);
                return res.status(401).json({ message: "Error decoding jwt" });
            }
            //@ts-ignore
            if (decoded.exp < Date.now() / 1000) {
                logger.debug("jwt is expired --> function isAuth " + timeNow);
                return res.status(401).json({ message: "JWT expired" });
            }
            //TODO remove ts-ignore
            //@ts-ignore
            req.tokenPayload = {...decoded};
            next();
        })
    } else {
        logger.debug("Authorization headers not found " + timeNow);
        return res.status(401).json({ message: "Can't find Authorization Bearer" });
    }

}
