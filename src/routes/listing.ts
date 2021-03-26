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
router.get(`/${TransactionTypes.RENT.endpoint}-:propertyType`, listingsController.getRent);

router.get(`/${TransactionTypes.SALE.endpoint}-:propertyType`, listingsController.getSale);

/**
* REST routes
*/
router.get("/listings/:transactionType-:propertyType", listingsController.getListings);


export default router;
