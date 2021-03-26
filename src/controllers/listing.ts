import { Request, Response, NextFunction } from "express";
import { PropertyTypes, TransactionTypes } from "../modelView/values";
import { CustomError } from "../utils/Error";
import { ICardProperty } from "../interfaces/ICardProperty";
import faker from "faker";

type GetListingsRequest = Request & {
    params: {
        propertyType: "1" | "2" | "3",
        transactionType: "1" | "2"
    }
}

type RenderListingsRequest = Request & {
    params: { propertyType: "apartamente" | "case" | "terenuri" }
};
type RenderListingsPageFunction = (req: RenderListingsRequest, res: Response, next: NextFunction, transactionType: { dbValue: number, endpoint: string, display: string }) => void;

let cardsProperties = [
    {
        shortId: 1,
        thumbnail: "https://storage.googleapis.com/undertowndevelopment/images/images/1593634707575-apartament-de-vanzare-3-camere-bucuresti-cismigiu-137184720.jpg",
        propertyType: 1,
        title: "Lucs apartments",
        address: "Bd Roseti",
        surface: 200,
        rooms: 3,
        price: 103,
        transactionType: 1
    },
    {
        shortId: 2,
        thumbnail: "https://storage.googleapis.com/undertowndevelopment/images/images/1593634707575-apartament-de-vanzare-3-camere-bucuresti-cismigiu-137184720.jpg",
        propertyType: 2,
        title: "Casa",
        address: "strada meduzei",
        rooms: 2,
        surface: 100,
        price: 202,
        transactionType: 2
    },
    {
        shortId: 4,
        thumbnail: "https://storage.googleapis.com/undertowndevelopment/images/images/1593634707575-apartament-de-vanzare-3-camere-bucuresti-cismigiu-137184720.jpg",
        propertyType: 3,
        title: "teren",
        address: "strada meduzei",
        surface: 100,
        price: 201,
        transactionType: 2
    }
];

/**
 * rendering properties.ejs
 * composing fetch url that react app will use to get properties cards
 */
const renderListingsPage: RenderListingsPageFunction = (req, res, next, transactionType) => {
    try {
        if (typeof req.params.propertyType === "undefined") {
            throw new Error("No property type provided");
        }

        let pageTitle: string[] = new Array();
        /**
         * Url for getListings
         * /listings/:transactionType-:propertyType
         */
        let fetchUrl: string;

        let propertyTypeParam = req.params.propertyType;

        pageTitle.push(transactionType["endpoint"]);
        pageTitle.push(propertyTypeParam);

        fetchUrl = `/listings/${transactionType.dbValue}-`;

        Object.entries(PropertyTypes).forEach((value) => {
            if (propertyTypeParam === value[1]["endpoint"]) {
                fetchUrl += value[1]["dbValue"]
            }
        })

        // create fetch url for client
        return res.status(200).render("pages/properties", {
            pageTitle: pageTitle.join(" "),
            imageUrl: "/img/banner-pages.jpg",
            path: "chirii",
            searchInput: "",
            fetchUrl: fetchUrl
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
 * @route GET /chirii-:propertyType
 */
export const getRent = (req: RenderListingsRequest, res: Response, next: NextFunction): void => {
    renderListingsPage(req, res, next, TransactionTypes.RENT);
};

/**
 * @route GET /vanzari-:propertyType
 */
export const getSale = (req: RenderListingsRequest, res: Response, next: NextFunction): void => {
    renderListingsPage(req, res, next, TransactionTypes.SALE)
};


/**
 * @route GET /listings/:transactionType-:propertyType
 * e.g. -> /listings/1-2
 */
export const getListings = async (req: GetListingsRequest, res: Response, next: NextFunction) => {

    // let fetchedData: Array<ICardProperty> = cardsProperties;

    let fetchedData: Array<ICardProperty> = [];

    for (let i = 0; i < 20; i++) {
        let prop: ICardProperty = {
            shortId: faker.random.number(10000),
            thumbnail: "https://storage.googleapis.com/undertowndevelopment/images/images/1593634707575-apartament-de-vanzare-3-camere-bucuresti-cismigiu-137184720.jpg",
            propertyType: Number(req.params.propertyType),
            title: faker.address.city(),
            address: faker.address.county(),
            surface: +faker.finance.amount(50, 500),
            rooms: faker.random.number(4) || 1,
            price: +faker.finance.amount(100, 1000),
            transactionType: Number(req.params.transactionType)
        };
        //@ts-ignore
        fetchedData.push(prop);
    }

    try {
        // axios request to /db_api
        return res.status(200).json({
            properties: fetchedData,
            propertyType: Number(req.params.propertyType),
            transactionType: Number(req.params.transactionType)
        })

    } catch (err) {
        //TODO make a function to avoid repetition
        res.status(500).json({ message: "Error occured" })
    }

}