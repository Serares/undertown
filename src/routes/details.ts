import { Router } from "express";
import { TransactionTypes, PropertyTypes} from "../modelView/values";
import * as detailsController from '../controllers/details';

const router = Router();

router.get(`/${TransactionTypes.RENT.endpoint}-${PropertyTypes.APARTMENTS.endpoint}/:shortId`, detailsController.getApartment);
router.get(`/${TransactionTypes.RENT.endpoint}-${PropertyTypes.HOUSE.endpoint}/:shortId`, detailsController.getHouse);
router.get(`/${TransactionTypes.RENT.endpoint}-${PropertyTypes.LAND.endpoint}/:shortId`, detailsController.getLand);

router.get(`/${TransactionTypes.SALE.endpoint}-${PropertyTypes.APARTMENTS.endpoint}/:shortId`, detailsController.getApartment);
router.get(`/${TransactionTypes.SALE.endpoint}-${PropertyTypes.HOUSE.endpoint}/:shortId`, detailsController.getHouse);
router.get(`/${TransactionTypes.SALE.endpoint}-${PropertyTypes.LAND.endpoint}/:shortId`, detailsController.getLand);

export default router;
