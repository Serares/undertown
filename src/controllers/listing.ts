import { getProperties } from "../services/getProperties";
import { queriedProperties } from "../services/queryProperties";
import { Request, Response, NextFunction } from "express";
import { SEARCH_STATUS } from "../interfaces/ESearchStatus";
import { CustomError } from "../utils/Error";

/**
 * @route GET /inchirieri
 */
export const getRent = (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return getProperties(req, res, next, SEARCH_STATUS.RENT);
};

/**
 * @route GET /vanzare
 */
export const getSale = (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return getProperties(req, res, next, SEARCH_STATUS.SALE);
};

/**
 * @route POST /filter
 * Sending back a json with filtered properties
 */
export const filter = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    
    try {
        const dbInformations = await queriedProperties(req, null);
        const properties = dbInformations.properties;
        const paginationData = dbInformations.paginationData;

        if (!properties) {
            const error = new CustomError("Something went wrong");
            error.statusCode = 404;
            error.statusMessage = "Can't find properties when filtering";
            throw error;
        }

        if (properties.length < 1) {
            return res.status(404).json({ message: "No properties found", properties: [] });
        }

        return res.status(200).json(
            {
                message: "Filtered properties",
                properties: JSON.stringify(properties),
                paginationData: JSON.stringify(paginationData)
            });
    } catch (err) {
        if (err.statusCode === 404) {
            console.log(err);
            return res.status(404).json({ message: err.status });
        } else {
            console.log("Got an error line 140:", err);
            const error = new CustomError("Network error");
            error.statusCode = 500;
            error.statusMessage = "Server error";
            next(error);
        }
    }
    
};