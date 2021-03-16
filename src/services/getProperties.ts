import { NextFunction, Request, Response } from "express";
import { SEARCH_STATUS } from "../interfaces/ESearchStatus";
import { validationResult } from "express-validator";
import { CustomError } from "../utils/Error";


export const getProperties = async function (req: Request, res: Response, next: NextFunction, searchCode: SEARCH_STATUS): Promise<void> {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        // TODO render validation errors
        return res.redirect("/404");
    }
    //@ts-ignore
    let propertyType: endpointsParams = req.params.propertyType;
    let pageTitle: string;
    let pagePath: string = "";
    let biggestPrice: number = 0;
    
    //TODO find a way to not hardcode the strings
    switch (searchCode) {
        case (SEARCH_STATUS.SALE):
            pageTitle = "Vanzare";
            pagePath = "vanzari" + propertyType;
            break;
        case (SEARCH_STATUS.RENT):
            pageTitle = "Inchiriere";
            pagePath = "chirii" + propertyType;
            break;
        default:
            pageTitle = "";
            break;
    }

    try {
        const property_type = req.query.property_type || "";
        const search_input = req.query.search_input || "";

        //TODO get biggest price in a property collection
        const biggestPriceProperty = [1000];

        biggestPrice = biggestPriceProperty[0];

        return res.status(200).render("pages/properties", {
            path: `/${pagePath}`,
            pageTitle: pageTitle,
            imageUrl: "/img/banner-pages.jpg",
            maxPrice: biggestPrice,
            search_status: searchCode,
            search_input: search_input,
            property_type: property_type
        });

    } catch (err) {
        //TODO make a function to avoid repetition
        console.log("Got an error querying the DB: ", err);
        const error = new CustomError("Network error, from getProperties");
        error.statusCode = 500;
        error.statusMessage = err.toString();
        next(error);
    }

};