import { Response } from 'express';

export const sendJSONresponse = function (res: Response, status: number, content: any) {
    return res.status(status).json(content);
};
