import { Router } from "express";
import { body, check, param} from "express-validator";
import * as listingsController from "../controllers/listing";
const router = Router();

const endpointsParams: string[] = ["apartamente" ,"case" ,"terenuri"]

/**
 * mvc routes
 */
router.get("/chirii/:propertyType", [
    param("propertyType", "No property type provided")
    .isIn(endpointsParams)
],listingsController.getRent);
router.get("/vanzari/:propertyType", listingsController.getSale);

/**
* REST routes
*/
router.post("/filter", listingsController.filter);
router.get("/listings/:transactionType/:propertyType", listingsController.listings);


export default router;
