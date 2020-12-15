import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/Error";

import {Property} from "../models/property";
// TODO sendgrid free tier is over, find other ways to send emails
import sendgridApi from "@sendgrid/mail";
sendgridApi.setApiKey(process.env.SENDGRID_KEY || "");

import { validationResult } from "express-validator/check";
import { getTimeDifferenceEachProperty } from "../utils/getTimeDifference";

import { getProperties } from "../services/getProperties";
import { queriedProperties } from "../services/queryProperties";
import { getSingleProperty } from "../services/getSingleProperty";
import { getPropertyTypes } from "../utils/getPropertyTypes";
import { addDisplayPriceProperties } from "../utils/addDisplayPriceProperties";

import url from "url";

export enum SEARCH_STATUS {
    RENT = 2,
    SALE = 1
}

export class HomeController {
    /**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {String} SEARCH_STATUS inchiriere/vanzare
 * @param {Number} pageNumber 
 */
    public async getHomepage(req: Request, res: Response, next: NextFunction): Promise<void> {
        let featProperties = [];
        let message = req.flash("message");
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }

        try {
            featProperties = await Property.find({ featured: 1 });
            getTimeDifferenceEachProperty(featProperties);
            addDisplayPriceProperties(featProperties);

            const propertyTypes = await getPropertyTypes();
            return res.render("pages/home/home", {
                path: "/",
                pageTitle: "UNDERTOWN",
                featProperties: featProperties,
                errorMessage: message,
                validationErrors: [],
                oldInput: {
                    search: ""
                },
                property_type: null,
                propertyTypes: propertyTypes
            });
            //TODO create an interface for error objects
        } catch (e) {
            console.log("Got an error:", e);
            const error = new CustomError("Network error");
            error.statusCode = 500;
            error.statusMessage = "error";
            next(error);
        }
    }

    public async getRent(req: Request, res: Response, next: NextFunction): Promise<void> {
        // TODO create a class of services that hass all the files as methods
        return getProperties(req, res, next, SEARCH_STATUS.RENT);
    }

    public async getSale(req: Request, res: Response, next: NextFunction): Promise<void> {
        return getProperties(req, res, next, SEARCH_STATUS.SALE);
    }

    public async getPropertyRent(req: Request, res: Response, next: NextFunction): Promise<void> {
        //TODO create an enum or an interface for path constants
        const path = "/inchiriere_s";
        return getSingleProperty(req, res, next, path);
    }

    public async getPropertySale(req: Request, res: Response, next: NextFunction): Promise<void> {
        // TODO path constant
        const path = "/vanzare_s";
        return getSingleProperty(req, res, next, path);
    }

    public getContactpage(req: Request, res: Response, next: NextFunction): void {
        return res.render("pages/home/contact", {
            path: "/contact",
            pageTitle: "Contact",
            imageUrl: "/img/banner-pages.jpg"
        });
    }

    public getAboutpage(req: Request, res: Response, next: NextFunction): void {
        return res.render("pages/home/about_us", {
            path: "/about",
            pageTitle: "Despre Noi",
            imageUrl: "/img/hero-image.jpg",
            middleImageUrl: "/img/about/about_us_middle_image.jpg"
        });
    }

    public async properties(req: Request, res: Response, next: NextFunction): Promise<Response<void> | undefined> {
        //filtrare dupa adresa din filtre
        try {
            // TODO find a logic where you don't need to use null a a parameter
            // doing a sorting only on price, surface and floor
            const dbInformations = await queriedProperties(req, null);
            const properties = JSON.parse(JSON.stringify(dbInformations.properties.slice()));
            const paginationData = dbInformations.paginationData;

            addDisplayPriceProperties(properties);

            if (!properties) {
                const error = new CustomError("Something went wrong");
                error.statusCode = 404;
                error.statusMessage = "Can't find properties when filtering";
                throw error;
            }
            if (properties.length < 1) {
                return res.status(404).json({ message: "No properties found", properties: [] });
            }

            return res.status(200).json(
                {
                    message: "Filtered properties",
                    properties: JSON.stringify(properties),
                    paginationData: JSON.stringify(paginationData)
                });
        } catch (err) {
            if (err.statusCode === 404) {
                console.log(err);
                return res.status(404).json({ message: err.status });
            } else {
                console.log("Got an error line 140:", err);
                const error = new CustomError("Network error");
                error.statusCode = 500;
                error.statusMessage = "Server error";
                next(error);
            }
        }
    }

    public postSendEmail(req: Request, res: Response, next: NextFunction): Response<void> | void {
        // check if there are errors and display 'em
        // send data back with the fields that need to be highlighted red
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            return res.status(422).json({ error: errors });
        }
        // if there is no contactPerson(single_property) then use the default email ( contact page )
        const RECIVER_EMAIL = req.body["CONTACT_PERSON_EMAIL"] || process.env.DEFAULT_EMAIL;
        console.log("Reciver email", RECIVER_EMAIL);
        // TODO create an object for this message
        const email = {
            to: RECIVER_EMAIL,
            from: process.env.FROM_EMAIL || "",
            subject: "UNDERTOWN MESAJ",
            html: `
        <h2>Numele: ${req.body.firstname} ${req.body.lastname} </h2>
        <h2>Email: ${req.body.email} </h2>
        <p>${req.body.message}</p>
      `
        };

        // data that will be in here
        sendgridApi.send(email)
            .then(() => {
                return res.status(200).json({ message: "Email trimis, cu succes" });
            })
            // TODO add a type to this error from @sendgrid/mail
            .catch((err: any) => {
                console.log("Eroare trimitere email", RECIVER_EMAIL, err);
                return res.status(404).json({ message: "Emailul nu a putut fi trimis" });
            });
    }

    public async postHomepage(req: Request, res: Response, next: NextFunction): Promise<void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            try {
                const featProperties = await Property.find({ featured: 1 });
                getTimeDifferenceEachProperty(featProperties);
                addDisplayPriceProperties(featProperties);
                const propertyTypes = await getPropertyTypes();

                return res.status(422).render("pages/home/home", {
                    path: "/",
                    pageTitle: "UNDERTOWN",
                    featProperties: featProperties,
                    errorMessage: errors.array()[0].msg,
                    validationErrors: errors.array(),
                    oldInput: {
                        search: req.body.search_input
                    },
                    property_type: null,
                    propertyTypes: propertyTypes
                });
            } catch (err) {
                console.log("Error eccured in homepageController: ", err);
                const error = new CustomError("Network error");
                error.statusCode = 500;
                error.statusMessage = "Server error";
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
    }
}
