import { Response } from 'express';
import logger, { timeNow } from './logger';

export const sendJSONresponse = function (res: Response, status: number, content: any) {
    if(status > 499) {
        logger.debug(`Error -> ${content} -> time: ${timeNow}`)
    }
    return res.status(status).json(content);
};
