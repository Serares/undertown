import { Request, Response, NextFunction } from "express";
import { PropertyTypes, TransactionTypes, ModelViewDictionary } from "../modelView/values";
import { CustomError } from "../utils/Error";
import { ICardProperty } from "../interfaces/ICardProperty";
import faker from "faker";
import { dbApiRequest } from '../services/serverRequests';
import { EPropertyTypes } from "../interfaces/EPropertyTypes";
import { sendJSONresponse } from "../utils/sendjsonresponse";

type GetListingsRequest = Request & {
    params: {
        propertyType: "1" | "2" | "3",
        transactionType: "1" | "2"
    }
};

const dbApiEndpoints = {
    [EPropertyTypes.APARTMENT]: "/admin/getAllApartments/",
    [EPropertyTypes.HOUSE]: "/admin/getAllHouses/",
    [EPropertyTypes.LANDANDCOMMERCIAL]: "/admin/getAllLands/"
}

const getAllPropertiesEndpoinGenerator = (propertyType: string, transactionType: string) => {
    let str = "";
    //@ts-ignore
    str = str.concat(dbApiEndpoints[Number(propertyType)]);
    str = str.concat(transactionType);
    return str;
};

type RenderListingsPageFunction = (req: Request, res: Response, next: NextFunction, urlInfo: [ModelViewDictionary, ModelViewDictionary]) => void;

/**
 * rendering properties.ejs
 * composing fetch url that react app will use to get properties cards
 * urlInfo [TransactionType, PropertyType]
 */
const renderListingsPage: RenderListingsPageFunction = (req, res, next, urlInfo) => {
    try {
        if (typeof urlInfo === "undefined") {
            throw new Error("No property type provided");
        }

        let pageTitle: string[] = new Array();
        /**
         * Url for getListings
         * /listings/:transactionType-:propertyType
         */
        let fetchUrl: string;

        pageTitle.push(urlInfo[0]["endpoint"]);
        pageTitle.push(urlInfo[1]["endpoint"]);

        fetchUrl = `/listings/${urlInfo[0]["dbValue"]}-${urlInfo[1]["dbValue"]}`;

        // create fetch url for client
        return res.status(200).render("pages/properties", {
            pageTitle: pageTitle.join(" "),
            fetchUrl: fetchUrl,
            path: pageTitle.join(" ")
        });

    } catch (err) {
        //TODO make a function to avoid repetition
        console.log("Got an error querying the DB: ", err);
        const error = new CustomError("Network error, from renderListingsPage");
        error.statusCode = 500;
        error.statusMessage = err.toString();
        next(error);
    }
}

/**
 * @route GET /listings/:transactionType-:propertyType
 * e.g. -> /listings/1-2
 */
export const getListings = async (req: GetListingsRequest, res: Response, next: NextFunction) => {

    // let fetchedData: Array<ICardProperty> = cardsProperties;

    // let fetchedData: Array<ICardProperty> = [];
    const transactionType = req.params.transactionType;
    const propertyType = req.params.propertyType;
    let dbEndpoint = getAllPropertiesEndpoinGenerator(propertyType, transactionType);

    try {
        const response = await dbApiRequest.get(dbEndpoint);
        const properties: ICardProperty[] = response.data;
        // axios request to /db_api
        return res.status(200).json({
            properties: properties,
            propertyType: Number(req.params.propertyType),
            transactionType: Number(req.params.transactionType)
        })

    } catch (err) {
        return sendJSONresponse(res, 500, "Error occured -> getListings")
    }

}

/**
 * @route GET /transactionType-apartamente
 */
export const getApartments = (req: Request, res: Response, next: NextFunction, transactionType: ModelViewDictionary) => {
    renderListingsPage(req, res, next, [transactionType, PropertyTypes.APARTMENTS]);
}

/**
 * @route GET /transactionType-case
 */
export const getHouse = (req: Request, res: Response, next: NextFunction, transactionType: ModelViewDictionary) => {
    renderListingsPage(req, res, next, [transactionType, PropertyTypes.HOUSE]);
}

/**
 * @route GET /transactionType-terenuri
 */
export const getLand = (req: Request, res: Response, next: NextFunction, transactionType: ModelViewDictionary) => {
    renderListingsPage(req, res, next, [transactionType, PropertyTypes.LAND]);
}
