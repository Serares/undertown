import { Request, Response, NextFunction } from 'express';
import faker from 'faker';
import { dbApi } from '../services/axios';


// TODO create propertyDetails type
const renderDetailsPage = (req: Request, res: Response, next: NextFunction, propertyDetails: any) => {
    return res.render("pages/single_property", {
        propertyInfo: propertyDetails,
        pageTitle: propertyDetails.title,
        //TODO path
        path: "/TODO"
    })
}

/**
 * @route GET /transactionType-apartamante/:shortId
 */
export const getApartment = (req: Request, res: Response, next: NextFunction) => {
    /*
    dbApi.get(`/${}-`)
        .then((data) => {
            renderDetailsPage(req, res, next, data);
        })
        .catch(err => {
            next(err);
        })
        */
    let fakedDetailsPage = {
        shortId: faker.random.number(1000),
        price: faker.random.number(10000),
        propertyType: faker.random.number(3) || 1,
        images: ["https://storage.googleapis.com/undertowndevelopment/images/images/1593634707575-apartament-de-vanzare-3-camere-bucuresti-cismigiu-137184720.jpg", "https://storage.googleapis.com/undertowndevelopment/images/images/1593634707575-apartament-de-vanzare-3-camere-bucuresti-cismigiu-137184720.jpg"],
        title: "Luxury Apartment Shuttle",
        address: faker.address.county(),
        features: {
            rooms: faker.random.number(4),
            buildingType: "bloc",
            partitioning: "decomandat",
            floor: 4,
            comfort: "lucs",
            usableArea: faker.random.number(50),
            totalUsableArea: faker.random.number(50),
            constructionYear: "2005",
            structure: "beton",
            buildingHeight: "S+P+4 Etaje",
            orientation: "Sud-Vest"
        },
        // longitude latitude order
        localization: [25, 44],
        description: faker.lorem.paragraph(),
        utilities: {
            general: ["Curent", "Apa", "Canalizare"],
            heatingSystem: ["Centrala Proprie"],
            conditioning: ["Aer conditionat"],
        },
        amenities: {
            building: ["Interfon", "Curte"]
        }
    };
    return renderDetailsPage(req, res, next, fakedDetailsPage)
}

/**
 * @route GET /transactionType-case/:shortId
 */
export const getHouse = (req: Request, res: Response, next: NextFunction) => {
    /*
    dbApi.get(`/${}-`)
        .then((data) => {
            renderDetailsPage(req, res, next, data);
        })
        .catch(err => {
            next(err);
        })
        */
    let fakedDetailsPage = {
        
    };
    return renderDetailsPage(req, res, next, fakedDetailsPage)
}

/**
 * @route GET /transactionType-terenuri/:shortId 
 */
export const getLand = (req: Request, res: Response, next: NextFunction) => {
    /*
    dbApi.get(`/${}-`)
        .then((data) => {
            renderDetailsPage(req, res, next, data);
        })
        .catch(err => {
            next(err);
        })
        */
    let fakedDetailsPage = {
       
    };
    return renderDetailsPage(req, res, next, fakedDetailsPage)
}
