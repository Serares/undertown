import {Router} from 'express';
import * as aboutController from '../controllers/about';

const router = Router();

router.get("/despre", aboutController.getAboutpage);

export default router;