import { Router } from "express";
import { body, check } from "express-validator";
import * as listingsController from "../controllers/listing";
const router = Router();

router.get("/inchirieri", listingsController.getRent);

router.get("/vanzare", listingsController.getSale);

/**
* filter routes
*/
router.post("/filter", listingsController.filter);

export default router;
