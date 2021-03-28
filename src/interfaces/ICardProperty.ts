import { EPropertyTypes } from "./EPropertyTypes";
import { ETransactionType } from "./ETransactionType";

export interface ICardProperty {
    shortId: number;
    thumbnail: string;
    propertyType: EPropertyTypes;
    title: string;
    address: string;
    rooms?: number;
    surface: number;
    price: number;
    transactionType: ETransactionType
}