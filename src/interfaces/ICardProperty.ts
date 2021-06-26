import { EPropertyTypes } from "./EPropertyTypes";
import { ETransactionType } from "./ETransactionType";

export interface ICardProperty {
    shortId: number;
    thumbnail: string;
    propertyType: EPropertyTypes;
    title: string;
    address: string;
    features: {
        usableArea: number;
        rooms?: number;
    };
    price: number;
    transactionType: ETransactionType;
}