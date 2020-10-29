import { IProperty } from '../models/property';

let currencyFormat = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
})

export const addDisplayPriceProperty = function (property: IProperty) {
    let displayPrice = currencyFormat.format(property['pret']);
    property['displayPrice'] = displayPrice;
}


export const addDisplayPriceProperties = function (properties: IProperty[]) {
    properties.forEach(property => {
        let displayPrice = currencyFormat.format(property['pret']);
        property['displayPrice'] = displayPrice;
    });
}
