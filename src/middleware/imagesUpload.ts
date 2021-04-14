import { Request } from "express";
import multer from "multer";
import { GCS_BUCKET, GCLOUD_PROJECT_ID } from '../utils/secrets';
import { IRequestUserCredentials } from "../interfaces/IRequestUserCredentials";
import logger from "../utils/logger";
import path from 'path';
import { nanoid } from 'nanoid';

const serviceKey = path.join(process.cwd(), "config", "keys.json");
console.log(serviceKey);
import { Storage } from '@google-cloud/storage';
// TODO search other ways of accessing cloud storage besides service accounts
//TODO add the keys from keys.json to .env and from them create the file at runtime
const storage = new Storage({
    keyFilename: serviceKey,
    projectId: GCLOUD_PROJECT_ID
});
const bucket = storage.bucket(GCS_BUCKET);

const fileFilter = (req: Request, file: { mimetype: string; }, cb: (arg0: null, arg1: boolean) => void) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        console.log("Not an image");
        cb(null, false);
    }
};


function getPublicUrl(filename: any) {
    return `https://storage.googleapis.com/${GCS_BUCKET}/${filename}`;
};

export const uploadMulter = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: {
        fileSize: 7 * 1024 * 1024, // no larger than 7mb
    },
});

export const sendUploadToGCS = (req: IRequestUserCredentials, res: any, next: any) => {
    if (!req.files && !req.body) {
        return next();
    }
    /**
     * subdirectory will be a unique id created when images are uploaded, it will reference the submited GCS images
     */
    let subdirectory = nanoid(4);

    if (!subdirectory) {
        return res.status(401).json({ message: "No id generated" })
    }
    /**
     * add uploaded images urls and send them to Property Schema
     */
    let uploadedImagesUrls: string[] = [];
    let promises: Array<Promise<any>> = [];
    Array.prototype.forEach.call(req.files, ((image: any, index: any) => {
        const gcsname = `userProperties/${subdirectory}/${Date.now()}_${image.originalname}`;
        uploadedImagesUrls.push(gcsname);
        const file = bucket.file(gcsname);
        const promise = new Promise((resolve, reject) => {
            file.createWriteStream({
                metadata: {
                    contentType: image.mimetype
                }
            })
                .on('error', (err) => {
                    image.cloudStorageError = err;
                    next(err);
                })
                .on('finish', async () => {
                    try {
                        image.cloudStorageObject = gcsname;
                        // this is causing an error
                        // await file.makePublic();
                        image.cloudStoragePublicUrl = getPublicUrl(gcsname);
                        resolve("Upload success");
                    } catch (err) {
                        logger.debug("Upload to GCS Failed -> " + new Date().toTimeString())
                        reject(err)
                    }

                })
                .end(image.buffer);
        })
        promises.push(promise);
    }))

    Promise.all(promises)
        .then(data => {
            promises = [];
            req.user.payload.user.imagesURL = uploadedImagesUrls;
            next();
        })
        .catch(next);
}
