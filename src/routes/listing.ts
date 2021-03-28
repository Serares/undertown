import { Router } from "express";
import { body, check, param } from "express-validator";
import { PropertyTypes, TransactionTypes } from "../modelView/values";
import * as listingsController from "../controllers/listing";
const router = Router();

//TODO rename the endpoints after each property because properties shold not be relative like ID's are, properties are always the same
// do that at a latter stage
/**
 * mvc routes
 */
router.get(`/${TransactionTypes.RENT.endpoint}-${PropertyTypes.APARTMENTS.endpoint}`, (req, res, next) => { listingsController.getApartments(req, res, next, TransactionTypes.RENT) });
router.get(`/${TransactionTypes.RENT.endpoint}-${PropertyTypes.HOUSE.endpoint}`, (req, res, next) => { listingsController.getHouse(req, res, next, TransactionTypes.RENT) });
router.get(`/${TransactionTypes.RENT.endpoint}-${PropertyTypes.LAND.endpoint}`, (req, res, next) => { listingsController.getLand(req, res, next, TransactionTypes.RENT) });

router.get(`/${TransactionTypes.SALE.endpoint}-${PropertyTypes.APARTMENTS.endpoint}`, (req, res, next) => { listingsController.getApartments(req, res, next, TransactionTypes.SALE) });
router.get(`/${TransactionTypes.SALE.endpoint}-${PropertyTypes.HOUSE.endpoint}`,  (req, res, next) => { listingsController.getHouse(req, res, next, TransactionTypes.SALE) });
router.get(`/${TransactionTypes.SALE.endpoint}-${PropertyTypes.LAND.endpoint}`,  (req, res, next) => { listingsController.getLand(req, res, next, TransactionTypes.SALE) });

/**
* REST routes
*/
router.get("/listings/:transactionType-:propertyType", listingsController.getListings);


export default router;
