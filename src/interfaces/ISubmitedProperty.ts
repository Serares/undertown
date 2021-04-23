import { EPropertyTypes } from "./EPropertyTypes";
import { ETransactionType } from "./ETransactionType";

export default interface ISubmitedProperty {
    title: string,
    description: string,
    transactionType: ETransactionType
    propertyType: EPropertyTypes
    surface: string | number,
    rooms?: string | number,
    price: string | number,
    address: string,
    imagesUrls?: string[],
    gcsSubfolderId?: string
}