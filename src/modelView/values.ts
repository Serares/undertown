import { EPropertyTypes } from "../interfaces/properties/EPropertyTypes";

export const landFeatures = [
    {
        display: "Suprafață",
        modelKey: "surface"
    }
];

export const housingFeatures = [
    {
        display: "Camere",
        modelKey: "rooms"
    },
    {
        display: "Suprafață",
        modelKey: "surface"
    }
];

const displayPropertyTypes = {
    1: "Apartamente",
    2: "Case",
    3: "Terenuri"
};

export const propertyTypes = Object.entries(displayPropertyTypes);
