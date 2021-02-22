import { Request } from "express";
import multer from "multer";

// TODO refactor middleware for TS
// TODO this will be used in admin backend
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
/*
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new aws.S3();
const bucket = process.env.S3_BUCKET || "";
const upload = multer({
    fileFilter: fileFilter,
    storage: multerS3({
        s3: s3,
        bucket: bucket,
        acl: "public-read",
        metadata: (req: Request, file, cb) => {
            console.log("BODY", req.body);
            const id = new Date().getTime().toString();
            cb(null, Object.assign({}, { id: id }));
        },
        key: (req, file, cb) => {
            cb(null, "images/" + Date.now().toString() + "-" + file.originalname);
        }
    })
});

export const uploadImages = function () {
    return upload.array("imagini", 10);
};
*/

export const uploadImages = function() {};