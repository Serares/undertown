import { Router } from 'express';
import { body, check } from 'express-validator';
import * as contactController from '../controllers/contact';

const router = Router();

router.get("/contact", contactController.getContactpage);

router.post("/send_email", [
    check("email", "Email invalid")
        .isEmail()
        .isLength({ min: 5 }),
    body("lastname","Nume invalid")
        .isLength({ min: 3 })
        .trim(),
    body("firstname","Nume invalid")
        .isLength({ min: 3 })
        .trim(),
    body("message", "Message has a length of less than 6 characters")
        .trim()
        .isLength({ min: 6 })
], contactController.postSendEmail);

export default router;