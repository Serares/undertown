import { Router } from "express";
import { removeUserSubmitedImages } from '../middleware/gcsStorage';
const router = Router();

router.post("/deleteUserSubmitedImages/:subfolderId", removeUserSubmitedImages);
router.post("/deleteAdminSubmitedImages/:subfolderId",);
router.put("/updateAdminSubmitedImages/:subfolderId",);


export default router;
