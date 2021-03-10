import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/Error";
import { validationResult } from "express-validator/check";
import url from "url";
import { homepageFormatting } from "../modelView/homepageFormatting";

const featProperties = [
    {
        identification: {
            propertyType: "apartment",
            alias: "123123",
            agent: "Vlady Object.ID",
            ownerData: "Burlan Cornelia"
        },
        localization: {
            residentialComplex: false,
            county: "Bucuresti",
            sector: "Sector 5",
            address: "Calea Plevnei"
        },
        price: {
            rent: {
                currency: "EUR",
                per_month: 700
            },
            sale: {
                currency: "EUR",
                price: 30000
            },
            includesVAT: true,
            details: "nu persoanelor sub 18 ani",
            comission: "30%"
        },
        features: {
            homeType: "apartament",
            partitioning: "decomandat",
            floor: 4,
            comfort: "lucs",
            usableArea: 33,
            totalUsavleArea: 24,
            builtArea: 12,
            title: "Luxury Apartment Shuttle",
            description: "Super bomba"
        },
        rooms: {
            number: 1,
            kitchens: 3,
            bathrooms: 1,
            balconies: 1,
            garages: 2,
            parkinglots: 2
        },
        buildingType: {
            type: "bloc de apartamente",
            floorsNumber: 21,
            basement: true,
            semiBasement: true,
            groundFloor: true,
            attic: true,
            constructionStatus: "la rosu",
            finishConstructionYear: "2019",
            constructionPeriod: "Dupa 2010",
            resitenceStructure: "something"
        },
        energyCertificate: {
            class: "A",
            totalConsumption: "10W",
            co2Emission: "20"
        },
        otherDetails: {
            details: "disponibil imediat",
            vicii: "vicentiu",
        },
        destination: {
            residential: true,
            commercial: false,
            office: false,
            vacation: false
        },
        utility: {
            general: ["Curent", "Apa", "Canalizare"],
            heatingSystem: ["Centrala Proprie"],
            conditioning: ["Aer conditionat"],

        }
    }
];

const featuredProperties = [
    {
        shortId: 1,
        thumbnail: "https://storage.googleapis.com/undertowndevelopment/images/images/1593634707575-apartament-de-vanzare-3-camere-bucuresti-cismigiu-137184720.jpg",
        propertyType: 1,
        title: "Lucs apartments",
        address: "Bd Roseti",
        surface: 200,
        rooms: 3,
        price: 103,
        transactionStatus: 1
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
        transactionStatus: 2
    },
    {
        shortId: 4,
        thumbnail: "https://storage.googleapis.com/undertowndevelopment/images/images/1593634707575-apartament-de-vanzare-3-camere-bucuresti-cismigiu-137184720.jpg",
        propertyType: 3,
        title: "teren",
        address: "strada meduzei",
        surface: 100,
        price: 201,
        transactionStatus: 2
    }
];

/**
* @route GET /
*/
export const getHomepage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        await homepageFormatting(featuredProperties);
        return res.render("pages/home", {
            path: "/",
            pageTitle: "UNDERTOWN",
            featuredProperties: featuredProperties,
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
export const postHomepage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        try {
            return res.status(422).render("pages/home", {
                path: "/",
                pageTitle: "UNDERTOWN",
                featuredProperties: featuredProperties,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                oldInput: {
                    search: req.body.search_input
                }
            });
        } catch (err) {
            const error = new CustomError("Network error", 500, "Home Controller Error, POST");
            next(error);
        }
    }
    // if no error is present, redirects to the searched criteria
    const queryObject = { ...req.body };
    const pathName = "/" + (req.body.property_status === "1" ? "vanzare" : "inchiriere");
    return res.status(302).redirect(url.format({
        pathname: pathName,
        query: queryObject
    }));
};
