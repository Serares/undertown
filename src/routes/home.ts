import { Router } from "express";
import { body, check } from "express-validator";
import * as homeController from "../controllers/home";

const router = Router();

router.route("/")
    .get(homeController.getHomepage)
    .post([
        body("property_status", "Selectează chirii/vânzări")
            .exists({ checkFalsy: true })
    ], homeController.postHomepage);

export default router;
