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

export type ModelViewDictionary = {
    display: string;
    endpoint: string;
    dbValue: number;
}

export const TransactionTypes: {[entry: string]: ModelViewDictionary} = {
    RENT: {
        display: "Chirii",
        endpoint: "chirii",
        dbValue: 2
    },
    SALE: {
        display: "Vanzari",
        endpoint: "vanzari",
        dbValue: 1
    }
};

export const PropertyTypes: {[entry: string]: ModelViewDictionary} = {
    APARTMENTS: {
        display: "Apartamente",
        endpoint: "apartamente",
        dbValue: 1
    },
    HOUSE: {
        display: "Case",
        endpoint: "case",
        dbValue: 2
    },
    LAND: {
        display: "Terenuri",
        endpoint: "terenuri",
        dbValue: 3
    }
}

