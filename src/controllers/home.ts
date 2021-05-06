import { NextFunction, Request, Response } from "express";
import url from "url";
import { CustomError } from "../utils/Error";
import { validationResult } from "express-validator/check";
import { PropertyTypes, TransactionTypes } from "../modelView/values";
import { ETransactionType } from "../interfaces/ETransactionType";
import { EPropertyTypes } from "../interfaces/EPropertyTypes";
import { dbApiRequest } from '../services/serverRequests';
import logger, { timeNow } from "../utils/logger";

type PostHomepageRequest = Request & {
    body: {
        propertyType: EPropertyTypes,
        transactionType: ETransactionType
    }
}

/**
* @route GET /
*/
export const getHomepage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //TODO create url for each property in controller
    try {
        let response = await dbApiRequest.get("/admin/getFeaturedProperties");
        let properties = response.data;
        return res.status(200).render("pages/home", {
            path: "/",
            pageTitle: "UNDERTOWN",
            featuredProperties: properties,
            errorMessage: null,
            validationErrors: [],
            oldInput: {
                search: ""
            }
        });
    } catch (e) {
        logger.debug(`Error at getHomepage -> ${e} -> ${timeNow}`);
        console.log(e);
        const error = new CustomError("Network error", 500, "Home Controller Error");
        next(error);
    }
};

/**
 * @route POST /
 */
export const postHomepage = async (req: PostHomepageRequest, res: Response, next: NextFunction): Promise<void> => {
    // TODO think how to make the query from homepage
    const buildRedirectUrl = (): string => {
        let pathName = "/";
        switch (Number(req.body.transactionType)) {
            case (ETransactionType.SALE):
                pathName += TransactionTypes.SALE.endpoint;
                break;
            case (ETransactionType.RENT):
                pathName += TransactionTypes.RENT.endpoint;
                break;
            default:
                throw new CustomError("Transaction type not provided", 402);
        };

        switch (Number(req.body.propertyType)) {
            case (EPropertyTypes.APARTMENT):
                pathName += "-" + PropertyTypes.APARTMENTS.endpoint
                break;
            case (EPropertyTypes.HOUSE):
                pathName += "-" + PropertyTypes.HOUSE.endpoint
                break;
            case (EPropertyTypes.LANDANDCOMMERCIAL):
                pathName += "-" + PropertyTypes.LAND.endpoint
                break;
            default:
                throw new CustomError("Property type not provided", 402);
        }
        return pathName;
    }

    // TODO add type for request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        try {
            let response = await dbApiRequest.get("/admin/getFeaturedProperties");
            let properties = response.data;
            return res.status(422).render("pages/home", {
                path: "/",
                pageTitle: "UNDERTOWN",
                featuredProperties: properties,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                oldInput: {
                    search: ""
                }
            });
        } catch (err) {
            const error = new CustomError("Network error", 500, "Home Controller Error, POST");
            next(error);
        }
    };

    try {
        const pathName = buildRedirectUrl();
        return res.status(302).redirect(url.format({
            pathname: pathName
        }));
    } catch (err) {
        next(err);
    }
};
