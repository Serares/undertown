import { Router } from "express";
import { body, check } from "express-validator";
import * as homeController from "../controllers/home";

const router = Router();

router.route("/")
    .get(homeController.getHomepage)
    .post([
        body("transactionType", "Selectează câmpul")
            .exists({ checkFalsy: true }),
        body("propertyType", "Selectează câmpul")
            .exists({ checkFalsy: true })
    ], homeController.postHomepage);

export default router;
