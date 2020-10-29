const fs = require('fs').promises;
import path from 'path';

// TODO create a class from this
export const getPropertyTypes = async function () {
    let parsedData;
    let filename = "";
    if (require && require.main) {
        filename = require.main.filename || ""
    }
    let rootDir = path.dirname(filename);
    let propertyTypes;

    return fs.readFile(path.join(rootDir, 'models', 'propertyFields.json'), 'utf8')
        .then((data: string) => {
            parsedData = JSON.parse(data);
            propertyTypes = JSON.parse(parsedData[0].tipuriProprietate);
            return propertyTypes;
        })
        .catch((err: any) => {
            console.log("err reading prop types");
            return err;
        })

}
