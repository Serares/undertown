import { Request } from "express";
import { SEARCH_STATUS } from "../interfaces/ESearchStatus";

//TODO add them in interfaces folder
interface IPaginationData {
    [property: string]: number | boolean
}

interface IReturnedData {
    paginationData: IPaginationData;
    properties: Array<{ [key: string]: string | number }>;
}

const propertiesListings = [
    {
        shortId: 1,
        thumbnail: "https://storage.googleapis.com/undertowndevelopment/images/images/1593634707575-apartament-de-vanzare-3-camere-bucuresti-cismigiu-137184720.jpg",
        propertyType: 1,
        title: "Lucs apartments",
        address: "Bd Roseti",
        surface: 200,
        rooms: 3,
        price: 103,
        transactionType: 1,
        imagesNumber: 9
    }
];

export const queriedProperties = async function (req: Request, SEARCH_STATUS_GETPROP: null | number): Promise<IReturnedData> {
    const ITEMS_PER_PAGE = 5;
    // TODO add a interface/enum for search status
    const SEARCH_STATUS: SEARCH_STATUS = SEARCH_STATUS_GETPROP || +req.body.SEARCH_STATUS;
    //TODO it won't get the query params because the url is different
    const pageNumber = +req.body.pageNumber || 1;
    const filterConditions = {};
    Object.assign(filterConditions, { status: SEARCH_STATUS });
    const paginationData: IPaginationData = {};

    let properties: [];
    const returnedData: IReturnedData = {
        properties: [],
        paginationData: {}
    };

    //from filters
    let priceRange = [];
    let areaRange = [];
    let floorRange = [];
    let area;
    let price;
    let floor;
    /**
     * @area String 0;1000
     * @price String: 0;1000
     * @etaj String 0;1000
     */
    try {
        area = req.body.area;
        price = req.body.price;
        floor = req.body.etaj;

        priceRange = price.split(";");
        areaRange = area.split(";");
        floorRange = floor.split(";");
        const filterObject = {
            pret: { $gte: +priceRange[0], $lte: +priceRange[1] },
            suprafata: { $gte: +areaRange[0], $lte: +areaRange[1] },
            etaj: { $gte: +floorRange[0], $lte: +floorRange[1] }
        };
        Object.assign(filterConditions, filterObject);
    } catch (err) {
        console.log("no filtered conditions found");
    }

    if (req.body.camere && req.body.camere !== "-1") {
        let filterObject: { camere: Object };
        if (+req.body.camere < 4) {
            filterObject = { camere: { $eq: +req.body.camere } };
        } else {
            filterObject = { camere: { $gte: +req.body.camere } };
        }
        Object.assign(filterConditions, filterObject);
    }
    if (req.body.bai && req.body.bai !== "-1") {
        let filterObject: { bai: Object };
        if (+req.body.bai < 3) {
            filterObject = { bai: { $eq: +req.body.bai } };
        } else {
            filterObject = { bai: { $gte: +req.body.bai } };
        }
        Object.assign(filterConditions, filterObject);
    }

    //SEARCH INPUT FROM HOME PAGE
    const SEARCH_INPUT = req.body.search_input || "";
    if (SEARCH_INPUT) {
        const regex = new RegExp(".*" + SEARCH_INPUT + "*.", "i");
        const filterObject = { adresa: { $regex: regex } };
        Object.assign(filterConditions, filterObject);
    }

    //if prop type comes from the form don't add the one from the hidden input
    if (req.body.PROPERTY_TYPE_HP) {
        const filterObject = { tipProprietate: { $eq: +req.body.PROPERTY_TYPE_HP } };
        Object.assign(filterConditions, filterObject);
    } else if (req.body.property_type && req.body.property_type !== "-1") {
        const filterObject = { tipProprietate: { $eq: +req.body.property_type } };
        Object.assign(filterConditions, filterObject);
    }

    if (req.body.property_furniture && req.body.property_furniture !== "-1") {
        const filterObject = { mobilat: { $eq: +req.body.property_furniture } };
        Object.assign(filterConditions, filterObject);
    }

    //sorting part
    let sortQuery: any = { createdAt: -1 };
    if (req.body.sort_order) {
        const sortOrderParams = req.body.sort_order.split(";");
        sortQuery = {};
        sortQuery[sortOrderParams[0]] = +sortOrderParams[1];
    }

    return new Promise((resolve, reject) => {
        const COUNT_PROPERTIES = propertiesListings.length;

        paginationData["pageNumber"] = pageNumber;
        paginationData["hasNextPage"] = ITEMS_PER_PAGE * pageNumber < COUNT_PROPERTIES;
        paginationData["hasPreviousPage"] = pageNumber > 1;
        paginationData["nextPage"] = pageNumber + 1;
        paginationData["previousPage"] = pageNumber - 1;
        paginationData["lastPage"] = Math.ceil(COUNT_PROPERTIES / ITEMS_PER_PAGE);
        paginationData["count_properties"] = COUNT_PROPERTIES;

        returnedData["properties"] = propertiesListings;
        returnedData["paginationData"] = paginationData;

        resolve(returnedData);
    });
};
