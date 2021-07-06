import { Request, Response, NextFunction } from 'express';
import { sendJSONresponse } from '../utils/sendjsonresponse';
import { dbApiRequest } from '../services/serverRequests';


// TODO create propertyDetails type
const renderDetailsPage = (req: Request, res: Response, next: NextFunction, propertyDetails: any) => {
    return res.render("pages/single_property", {
        propertyInfo: propertyDetails,
        pageTitle: propertyDetails.title,
        //TODO path
        path: `${propertyDetails.title}`
    })
}

/**
 * @route GET /transactionType-apartamante/:shortId
 */
export const getApartment = async (req: Request, res: Response, next: NextFunction) => {
    const shortId = req.params.shortId;
    if (!shortId) {
        return sendJSONresponse(res, 401, "No id provided");
    }
    try {
        const response = await dbApiRequest.get(`/admin/getApartment/${shortId}`);
        return renderDetailsPage(req, res, next, response.data);

    } catch (err) {
        if(err.response) {
            return sendJSONresponse(res, err.response.status, err.response.statusText)
        }
        sendJSONresponse(res, 500, "Error Occured");
    }
}

/**
 * @route GET /transactionType-case/:shortId
 */
export const getHouse = async (req: Request, res: Response, next: NextFunction) => {
    const shortId = req.params.shortId;
    if (!shortId) {
        return sendJSONresponse(res, 401, "No id provided");
    }
    try {
        const response = await dbApiRequest.get(`/admin/getHouse/${shortId}`);
        return renderDetailsPage(req, res, next, response.data);

    } catch (err) {
        if(err.response) {
            return sendJSONresponse(res, err.response.status, err.response.statusText)
        }
        sendJSONresponse(res, 500, "Error Occured");
    }

}

/**
 * @route GET /transactionType-terenuri/:shortId 
 */
export const getLand = async (req: Request, res: Response, next: NextFunction) => {
    const shortId = req.params.shortId;
    if (!shortId) {
        return sendJSONresponse(res, 401, "No id provided");
    }
    try {
        const response = await dbApiRequest.get(`/admin/getLand/${shortId}`);
        return renderDetailsPage(req, res, next, response.data);

    } catch (err) {
        if(err.response) {
            return sendJSONresponse(res, err.response.status, err.response.statusText)
        }
        sendJSONresponse(res, 500, "Error Occured");
    }

}
