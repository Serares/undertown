import { EPropertyTypes } from "../interfaces/properties/EPropertyTypes";
import { landFeatures, housingFeatures } from "./values";

/**
 * Layer that formats information from models.
 * It formats homepage properties features
 */
export const homepageFormatting = (featuredPropData: any) => {
    const inputData: Array<any> = featuredPropData;
    return new Promise((resolve, reject) => {

        if (inputData.length < 0)
            return reject("No data provided");

        inputData.forEach(async (property: any) => {
            if (!property.propertyType)
                return reject("Property has no propertyType ->" + property);

            property["features"] = [];
            switch (property.propertyType) {
                case (Number(EPropertyTypes.APARTMENT)):
                case (Number(EPropertyTypes.HOUSE)):
                    modelViewParse(property, housingFeatures);
                    break;
                case (Number(EPropertyTypes.LANDANDCOMMERCIAL)):
                    modelViewParse(property, landFeatures);
                    break;
                default:
                    return reject("Property type is not correct " + property.propertyType);
            }
        });

        resolve("Data formatted success");
    });
};

/**
 *Changes the refference of the object
 */
function modelViewParse(modelObject: any, viewFeatures: any): void {

    viewFeatures.forEach((obj: any) => {
        const object = {
            value: modelObject[obj["modelKey"]],
            display: obj["display"]
        };
        modelObject["features"].push(object);
    });
}
