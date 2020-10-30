import aws from "aws-sdk";
// TODO refactor this to typescript using a class

const deleteImagesS3 = (imagesArray: any[]) => {
    if (imagesArray.length < 1) {
        return "No images to delete";
    }

    const s3 = new aws.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
    let objectsArray: { Key: any; }[] = [];


    if (imagesArray.length > 0) {
        console.log("Deleted images array", imagesArray);
        objectsArray = imagesArray.map(image => {
            return {
                Key: image
            };
        });
    }
    const bucket = process.env.S3_BUCKET || "";

    return new Promise((resolve, reject) => {

        s3.deleteObjects({
            Bucket: bucket,
            Delete: {
                Objects: objectsArray
            }
        }, function (err, data) {
            if (err) {
                console.log("Error s3 deletion", err, err.stack);
                return reject(err);
            } else {
                console.log("Successfully deleted", imagesArray, data);
                return resolve(data);
            }
        });
    });
};

export default deleteImagesS3;