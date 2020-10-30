import { IProperty } from "../models/property";

/**
 * @param {property[]} properties 
 */
export const getTimeDifferenceEachProperty = function (properties: IProperty[]) {
    const dateNow: any = new Date();

    // add the createdTimeAgo property for each property
    properties.forEach((property) => {
        //TODO find out what type created at is
        const createdAtDate: any = new Date(property.createdAt);
        const diffTime = Math.abs(dateNow - createdAtDate);
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const diffHoursString = `Adaugat cu ${diffHours} ore in urmă`;
        const diffDaysString = `Adaugat cu ${diffDays} zile in urmă`;
        const createdTimeAgo = diffHours > 36 ? diffDaysString : diffHoursString;
        property["createdTimeAgo"] = createdTimeAgo;
    });
};

