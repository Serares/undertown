const fs = require("fs").promises;
import path from "path";

// I think this will be deprecated because Ill move the file to admin page on frontend

export const getPropertyTypes = async function () {
    let parsedData;
    let propertyTypes;
    return fs.readFile(path.join(process.cwd(), "misc", "propertyFields.json"), "utf8")
        .then((data: string) => {
            parsedData = JSON.parse(data);
            propertyTypes = JSON.parse(parsedData[0].tipuriProprietate);
            return propertyTypes;
        })
        .catch((err: any) => {
            console.log("err reading prop types", err);
            return err;
        });
};
