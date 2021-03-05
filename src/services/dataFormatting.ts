import { info } from 'winston';
import { EPropertyTypes } from '../interfaces/EPropertyTypes';

/**
 * Layer that formats information from backend
 * formats for homepage featured properties
 */
export const dataFormatting = async (featuredPropData: any) => {
    let inputData: Array<any> = featuredPropData;
    const landFeatures = ["surface"];
    const housingFeatures = ["rooms", "surface"];


}

function parseInformation(inputData: any): Promise<any> {
    return new Promise((resolve, reject) => {

        if (inputData.length < 0) {
            return reject("No data added")
        }

        inputData.forEach(property => {
            if (!property.propertyType)
                return reject("Property has no propertyType ->" + property);
            switch (property.propertyType) {
                case (Number(EPropertyTypes.APARTMENT)):
                    apartmentModelView(property);
                    break;
                case (Number(EPropertyTypes.HOUSE)):
                    houseModelView(property);
                    break;
                case (Number(EPropertyTypes.LANDANDCOMMERCIAL)):
                    landCommercialModelView(property);
                    break;
                default:
                    return reject("Property type is not correct " + property.propertyType);
            }
        })

        resolve("Data modified success");
    })
}
