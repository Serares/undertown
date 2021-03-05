import * as errorControllers from "../controllers/error";
import { Router } from "express";

const router = Router();

router.get("*", errorControllers.notFound);

export default router;
