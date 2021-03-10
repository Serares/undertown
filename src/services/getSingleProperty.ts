import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/Error";

export const getSingleProperty = async function (req: Request, res: Response, next: NextFunction, path: string) {
    /*
    const propertyId = req.params.id;
    try {
        const property = await Property.findById(propertyId).populate("persoanaContact");
        if (!property) {
            throw new CustomError("Can't find property");
        }
        const latLngValues = `${property.location["lat"]};${property.location["lng"]}`;

        return res.render("pages/home/single_property", {
            path: path,
            pageTitle: property.titlu,
            imageUrl: "/img/banner-pages.jpg",
            property: property,
            latlng: latLngValues
        });
    } catch (err) {
        console.log("Got an error", err);
        const error = new CustomError("Network error");
        error.statusCode = 500;
        error.statusMessage = "Got an error";
        next(error);
    }
    */
};
