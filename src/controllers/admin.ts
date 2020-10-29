import { Request, Response, NextFunction } from 'express';
import { Property } from '../models/property';
import { IRequestUserCredentials } from '../interfaces/IRequestUserCredentials';
// TODO refactor middleware for TS
import deleteImagesS3 from '../middleware/imagesDelete';
import faker from 'faker';
import { User } from '../models/user';
import fs from 'fs';
import path from 'path';
import { CustomError } from '../utils/Error';

export class AdminController {
    private handleError(): void {
        //TODO create a handle error method to get rid of DRY code 
    }

    public async getAllProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
        /*
                send an object with all properties added in db
            */

        try {
            let properties = await Property.find();
            if (!properties) {
                const error = new Error("No properties in the DB");
                throw error;
            }
            // console.log("Found properties", properties);
            res.status(200).json({ message: "Properties that you requested", properties: properties })
        } catch (err) {
            console.log("An error occured ", err);
            // TODO create a method to handle error in here
            const error = new CustomError('Cant fetch properties');
            error.statusCode = 500;
            error.statusMessage = "err";
            next(error);
        }
    }

    public async postAddProperty(req: IRequestUserCredentials, res: Response, next: NextFunction): Promise<void> {
        /**
         * first add the property to all properties collection
       then sending to whatever property collection it is e.g. 'apartamente', 'case'
         */

        // last image in the array is the first one selected actually :)
        let files = req.files as { [fieldname: string]: Express.Multer.File[] };

        let imagesKeys = Object.keys(files);

        console.log("Images -------", files);
        // console.log("Req body", objectFromClient);
        //TODO create a type for this array

        if (!imagesKeys) {
            let error = new CustomError("No images added");
            error.statusCode = 401;
            throw error;
        };
        // TODO think of a way to create the property and use the typechecking for Property properties/variables
        let property = new Property({
            // this is the person that's adding the property
            userId: req.user,
            persoanaContact: req.body.persoanaContact,
            titlu: req.body.titlu,
            thumbnail: imagesKeys[0],
            imagini: imagesKeys,
            status: req.body.status,
            tipProprietate: req.body.tipProprietate,
            pret: req.body.pret,
            detalii: req.body.detalii,
            adresa: req.body.adresa,
            etaj: req.body.etaj,
            bai: req.body.bai,
            camere: req.body.camere,
            mobilat: req.body.mobilat,
            suprafata: req.body.suprafata,
            caracteristici: JSON.parse(req.body.caracteristici),
            specificatii: JSON.parse(req.body.specificatii),
            location: JSON.parse(req.body.location_coordonates),
            featured: req.body.featured
        });
        try {
            // await property.save();
            res.status(200).json({ message: "Date primite", response: "Property saved " + req.body.titlu });
        } catch (err) {
            console.log("An error occured ", err);
            // TODO create a method to handle error in here
            const error = new CustomError('Cant fetch properties');
            error.statusCode = 500;
            error.statusMessage = "err";
            next(error);
        }

    }

    public async deleteProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
        let propertyId = req.params.id;
        // console.log("Got the request", propertyId);
        try {
            let foundProperty = await Property.findById(propertyId);
            if (foundProperty && foundProperty.imagini && foundProperty.imagini.length > 0) {
                let deletedImagesResponse = await deleteImagesS3(foundProperty.imagini);
                console.log("Deleted images status S3", deletedImagesResponse);
            }
            await Property.findByIdAndRemove(propertyId);

            res.status(200).json({ message: "Success delete property" });
        } catch (err) {
            console.log("An error occured ", err);
            // TODO create a method to handle error in here
            const error = new CustomError('Cant fetch properties');
            error.statusCode = 500;
            error.statusMessage = "err";
            next(error);
        }
    }

    public async changeProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
        // console.log("Got property data", req.body);
        // console.log("Got images", req.files);
        let propertyId = req.body.property_id;
        let deletedImages: Array<string> = [];
        let newImages: Array<string> = [];
        let existingImages: Array<string> = [];
        let imagesFiles = req.files;

        if (imagesFiles) {
            // TODO check what the object looks like
            newImages = Object.keys(imagesFiles);
            // for (let image of imagesFiles) {
            //     newImages.push(image.key);
            // }
        } else {
            //TODO create a message that there are no new images added
            console.log("No new images added-- provide FE feedback")
        }

        if (req.body.deletedImages) {
            deletedImages = JSON.parse(req.body.deletedImages);
        } else {
            console.log("There are no deleted images");
        }

        try {
            if (deletedImages.length > 0) {
                let deletedImagesResponse = await deleteImagesS3(deletedImages);
                console.log("Deleted images status S3", deletedImagesResponse);
            }
            // TODO test if .findById can return a null value
            let foundProperty = await Property.findById(propertyId);
            if (foundProperty) {
                existingImages = [...foundProperty.imagini];
            }

            if (deletedImages) {
                deletedImages.forEach(deletedImg => {
                    existingImages = existingImages.filter(existingImg => existingImg !== deletedImg);
                })
            }
            // had to add this guard for type checking
            // but there is no way that it would get here and 'foundProperty'
            // to be null, because try block will throw an error
            if (foundProperty) {
                // merging filteredImages array with newImages array
                let finalImagesForDb = [...existingImages, ...newImages];
                foundProperty.persoanaContact = req.body.persoanaContact;
                foundProperty.titlu = req.body.titlu;
                foundProperty.thumbnail = finalImagesForDb[0];
                foundProperty.imagini = finalImagesForDb;
                foundProperty.status = req.body.status;
                foundProperty.tipProprietate = req.body.tipProprietate;
                foundProperty.pret = req.body.pret;
                foundProperty.detalii = req.body.detalii;
                foundProperty.adresa = req.body.adresa;
                foundProperty.etaj = req.body.etaj;
                foundProperty.bai = req.body.bai;
                foundProperty.camere = req.body.camere;
                foundProperty.mobilat = req.body.mobilat;
                foundProperty.suprafata = req.body.suprafata;
                foundProperty.caracteristici = JSON.parse(req.body.caracteristici);
                foundProperty.specificatii = JSON.parse(req.body.specificatii);
                foundProperty.location = JSON.parse(req.body.location_coordonates);
                foundProperty.featured = req.body.featured;
                // delete the images from Mongo filter from deletedImages array
                // add the new ones sent here
                await foundProperty.save();
            }

            res.status(201).json({ message: "Got changed data, Property changed success", propertyId: propertyId });
        } catch (err) {
            console.log("An error occured ", err);
            // TODO create a method to handle error in here
            const error = new CustomError('Cant fetch properties');
            error.statusCode = 500;
            error.statusMessage = "err";
            next(error);
        }
    }

    public getWaintingApprovalProperties(req: Request, res: Response, next: NextFunction): void {
        // TODO the properties that users are sending for approval
    }

    public getPropertyFormFields(req: Request, res: Response, next: NextFunction): void {
        try {
            let obj;
            let rootDir = path.dirname(__dirname);

            fs.readFile(path.join(rootDir, 'models', 'propertyFields.json'), 'utf8', function (err, data) {
                if (err) throw err;
                obj = data;
                res.status(200).json(JSON.parse(data))
            })
        } catch (err) {
            console.log("An error occured ", err);
            // TODO create a method to handle error in here
            const error = new CustomError('Cant fetch properties');
            error.statusCode = 500;
            error.statusMessage = "err";
            next(error);
        }
    }

    public async getAdminAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let adminUsers = await User.find({ status: 'admin' });
            res.status(200).json({ accounts: adminUsers });
        } catch (err) {
            console.log("An error occured ", err);
            // TODO create a method to handle error in here
            const error = new CustomError('Cant fetch properties');
            error.statusCode = 500;
            error.statusMessage = "err";
            next(error);
        }
    }

    public async createProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
        // TODO create a MongoDB cluster for development purposes
        let numberOfProperties = Number(req.params.number);
        for (let i = 0; i < numberOfProperties; i++) {
            let imagesForProperty = ["images/1588526089612-1.jpg", "images/1588526089626-2.jpg", "images/1588526089655-3.jpg"];

            let property = new Property({
                userId: "5e9dd6c613b2f23ca039612c",
                persoanaContact: "5e9dd6c613b2f23ca039612c",
                titlu: faker.name.jobArea(),
                thumbnail: imagesForProperty[0],
                imagini: imagesForProperty,
                status: Math.round(Math.random()) ? 1 : 2,
                tipProprietate: Math.round(Math.random()) ? 2 : 1,
                pret: faker.commerce.price(),
                detalii: faker.company.companyName(),
                adresa: faker.address.city(),
                etaj: Math.round(Math.random()) ? 6 : 4,
                bai: Math.round(Math.random()) ? 6 : 4,
                camere: Math.round(Math.random()) ? 6 : 4,
                mobilat: Math.round(Math.random()) ? 1 : 0,
                suprafata: faker.finance.amount(),
                caracteristici: [{ key: "Strada", value: "Lacramioarei" }, { key: "Baie", value: "Da" }, { key: "Bucatarie", value: "Nu" }],
                specificatii: [{ name: "Utilitati", specs: ["Baie", "Canalizare", "Internet"] }, { name: "Zona", specs: ["Fara tigani", "Linistita", "Mega Image Aproape"] }],
                location: { lat: 43.946373515452244, lng: 28.629916190839143 },
                featured: Math.round(Math.random()) ? 1 : 0
            });
            try {
                await property.save();

            } catch (err) {
                console.log("An error occured ", err);
                // TODO create a method to handle error in here
                const error = new CustomError('Cant fetch properties');
                error.statusCode = 500;
                error.statusMessage = "err";
                next(error);
            }
        }
        console.log('Created properties', numberOfProperties);
        res.status(200).json({ message: "Date primite" });
    }
}
