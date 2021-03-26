import { Router } from "express";
import { TransactionTypes } from "../modelView/values";
import * as detailsController from '../controllers/details';

const router = Router();

router.get(`/${TransactionTypes.RENT.endpoint}-:propertyType/:shortId`);

router.get(`/${TransactionTypes.SALE.endpoint}-:propertyType/:shortId`);

export default router;
