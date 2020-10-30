import { Schema, model, Document, Types } from "mongoose";

interface ILocation {
    lat: number,
    lng: number
}

// helps to extend the document for later db query
interface IProperty extends Document {
    // TODO create interfaces for 'caracteristici' and 'specificatii'
    adresa: string;
    bai: number;
    camere: number;
    caracteristici: Array<string>;
    createdAt: string | number | Date;
    createdTimeAgo: string;
    detalii: string;
    displayPrice: string;
    etaj: number;
    featured: number;
    imagini: Array<string>;
    location: ILocation;
    mobilat: number;
    persoanaContact: Types.ObjectId;
    pret: number;
    status: number;
    specificatii: Array<string>;
    suprafata: number;
    titlu: string;
    tipProprietate: number;
    thumbnail: string;
    userId: Types.ObjectId | Record<string, unknown>;
}

const PropertySchemaFields = {

    userId: {
        //this is the id of the user that posted this property
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    titlu: {
        type: String,
        required: true
    },
    persoanaContact: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    thumbnail: String,
    imagini: {
        required: false,
        type: Array
    },
    //vanzare, inchiriere
    status: {
        required: true,
        type: Number
    },
    tipProprietate: {
        required: true,
        type: Number
    },
    pret: {
        required: true,
        type: Number
    },
    bai: {
        required: true,
        type: Number
    },
    etaj: {
        required: true,
        type: Number
    },
    mobilat: {
        required: true,
        type: Number
    },
    camere: {
        required: true,
        type: Number
    },
    detalii: {
        type: String,
        required: true
    },
    adresa: {
        type: String,
        required: true
    },
    suprafata: {
        type: Number,
        required: true
    },
    //primele 5 caracteristici pe care le posteaza o sa apara si pe frontEnd
    caracteristici: { type: Array, required: true },
    specificatii: { type: Array, required: true },
    location: {
        type: Object,
        required: true
    },
    featured: {
        type: Number,
        required: true
    }
};

const PropertySchema = new Schema(PropertySchemaFields, { timestamps: true });

// adding generic type will help with later trying to query the DB
const Property = model<IProperty>("Property", PropertySchema);

export { IProperty, Property };
// export default model>("Property", PropertySchema);
