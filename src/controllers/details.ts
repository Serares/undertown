import { getSingleProperty } from "../services/getSingleProperty";
import faker from 'faker';

const featProperties = [
    {
        identification: {
            propertyType: "apartment",
            alias: "123123",
            agent: "Vlady Object.ID",
            ownerData: "Burlan Cornelia"
        },
        localization: {
            residentialComplex: false,
            county: "Bucuresti",
            sector: "Sector 5",
            address: "Calea Plevnei"
        },
        price: {
            rent: {
                currency: "EUR",
                per_month: 700
            },
            sale: {
                currency: "EUR",
                price: 30000
            },
            includesVAT: true,
            details: "nu persoanelor sub 18 ani",
            comission: "30%"
        },
        features: {
            homeType: "apartament",
            partitioning: "decomandat",
            floor: 4,
            comfort: "lucs",
            usableArea: 33,
            totalUsavleArea: 24,
            builtArea: 12,
            title: "Luxury Apartment Shuttle",
            description: "Super bomba"
        },
        rooms: {
            number: 1,
            kitchens: 3,
            bathrooms: 1,
            balconies: 1,
            garages: 2,
            parkinglots: 2
        },
        buildingType: {
            type: "bloc de apartamente",
            floorsNumber: 21,
            basement: true,
            semiBasement: true,
            groundFloor: true,
            attic: true,
            constructionStatus: "la rosu",
            finishConstructionYear: "2019",
            constructionPeriod: "Dupa 2010",
            resitenceStructure: "something"
        },
        energyCertificate: {
            class: "A",
            totalConsumption: "10W",
            co2Emission: "20"
        },
        otherDetails: {
            details: "disponibil imediat",
            vicii: "vicentiu",
        },
        destination: {
            residential: true,
            commercial: false,
            office: false,
            vacation: false
        },
        utility: {
            general: ["Curent", "Apa", "Canalizare"],
            heatingSystem: ["Centrala Proprie"],
            conditioning: ["Aer conditionat"],

        }
    }
];

export const getRentDetails = (req, res, next) => {

}

export const getSaleDetails = (req, res, next) => {
    
}
