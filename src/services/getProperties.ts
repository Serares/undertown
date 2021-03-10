import { NextFunction, Request, Response } from "express";
import { SEARCH_STATUS } from "../interfaces/ESearchStatus";

import { CustomError } from "../utils/Error";

export const getProperties = async function (req: Request, res: Response, next: NextFunction, searchCode: SEARCH_STATUS) {
    let pageTitle: string;
    let pagePath: string = "";
    let biggestPrice: number = 0;
    // i need to send the sort and filter parameters when navigating through pages
    // figure out how
    // this function does not return properties actually 
    //TODO rename this function
    switch (searchCode) {
        case (SEARCH_STATUS.SALE):
            pageTitle = "Vanzare";
            pagePath = "vanzare";
            break;
        case (SEARCH_STATUS.RENT):
            pageTitle = "Inchiriere";
            pagePath = "inchiriere";
            break;
        default:
            pageTitle = "";
            break;
    }
    try {
        const property_type = req.query.property_type || "";
        const search_input = req.query.search_input || "";

        //TODO get biggest price
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