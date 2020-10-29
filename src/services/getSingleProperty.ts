import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../utils/Error';
import { Property } from '../models/property';
import { addDisplayPriceProperty } from '../utils/addDisplayPriceProperties';

export const getSingleProperty = async function (req: Request, res: Response, next: NextFunction, path: string) {
    let propertyId = req.params.id;
    try {
        let property = await Property.findById(propertyId).populate('persoanaContact');
        if(!property){
            throw new CustomError("Can't find property")
        }
        let latLngValues = `${property.location['lat']};${property.location['lng']}`;
        addDisplayPriceProperty(property);

        return res.render('pages/home/single_property', {
            path: path,
            pageTitle: property.titlu,
            imageUrl: '/img/banner-pages.jpg',
            property: property,
            latlng: latLngValues
        });
    } catch (err) {
        console.log("Got an error", err);
        let error = new CustomError("Network error");
        error.statusCode = 500;
        error.statusMessage = "Got an error";
        next(error);
    }
}
