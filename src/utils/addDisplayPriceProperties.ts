import { IProperty } from "../models/property";

const currencyFormat = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
});

export const addDisplayPriceProperty = function (property: IProperty): void {
    const displayPrice = currencyFormat.format(property["pret"]);
    property["displayPrice"] = displayPrice;
};


export const addDisplayPriceProperties = function (properties: IProperty[]): void {
    properties.forEach(property => {
        const displayPrice = currencyFormat.format(property["pret"]);
        property["displayPrice"] = displayPrice;
    });
};
