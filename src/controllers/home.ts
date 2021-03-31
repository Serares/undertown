import { NextFunction, Request, Response } from "express";
import url from "url";
import { CustomError } from "../utils/Error";
import { validationResult } from "express-validator/check";
import { PropertyTypes, TransactionTypes } from "../modelView/values";
import { ETransactionType } from "../interfaces/ETransactionType";
import { EPropertyTypes } from "../interfaces/EPropertyTypes";
import { ICardProperty } from "../interfaces/ICardProperty";
import faker, { fake } from 'faker';



type PostHomepageRequest = Request & {
    body: {
        propertyType: EPropertyTypes,
        transactionType: ETransactionType
    }
}

const getFeaturedProperties = (): Promise<Array<ICardProperty>> => {
    //TODO get from db only last 6 added properties from each collection
    return new Promise((resolve, reject) => {
        let fetchedData: Array<ICardProperty> = [];

        for (let i = 0; i < 6; i++) {
            let prop: ICardProperty = {
                shortId: faker.random.number(10000),
                thumbnail: "https://storage.googleapis.com/undertowndevelopment/images/images/1593634707575-apartament-de-vanzare-3-camere-bucuresti-cismigiu-137184720.jpg",
                propertyType: faker.random.number(3) || 1,
                title: faker.address.city(),
                address: faker.address.county(),
                surface: +faker.finance.amount(50, 500),
                rooms: faker.random.number(4) || 1,
                price: +faker.finance.amount(100, 1000),
                transactionType: faker.random.number(2) || 1
            };
            //@ts-ignore
            fetchedData.push(prop);
        }
        resolve(fetchedData)
    })
}

/**
* @route GET /
*/
export const getHomepage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //TODO create url for each property in controller
    try {
        let properties = await getFeaturedProperties();
        return res.render("pages/home", {
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
        const error = new CustomError("Network error", 500, "Home Controller Error");
        next(error);
    }
};

/**
 * @route POST /
 */
export const postHomepage = async (req: PostHomepageRequest, res: Response, next: NextFunction): Promise<void> => {
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
            let properties = await getFeaturedProperties();
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
