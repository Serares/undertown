import { Router } from "express";
import { body, check } from "express-validator";
import * as listingsController from "../controllers/listing";
const router = Router();
/**
 * mvc routes
 */
router.get("/chirii/:propertyType", listingsController.getRent);
router.get("/vanzari/:propertyType", listingsController.getSale);

/**
* REST routes
*/
router.post("/filter", listingsController.filter);

export default router;
