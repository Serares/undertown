import { Request, Response, NextFunction } from 'express';
import { SENDGRID_API_KEY, CONTACT_EMAIL } from '../utils/secrets';
import { validationResult } from 'express-validator';

import sendgridApi from '@sendgrid/mail';
sendgridApi.setApiKey(SENDGRID_API_KEY);


export const getContactpage = (req: Request, res: Response, next: NextFunction): void => {
    return res.render("pages/contact", {
        path: "/contact",
        pageTitle: "Contact",
    });
}

// TODO test this
export const postSendEmail = (req: Request, res: Response, next: NextFunction): Response<void> | void => {
    // check if there are errors and display 'em
    // send data back with the fields that need to be highlighted red
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).json({ error: errors });
    }
    // if there is no contactPerson(single_property) then use the default email ( contact page )
    console.log("Reciver email", CONTACT_EMAIL);
    const email = {
        to: CONTACT_EMAIL,
        from: process.env.FROM_EMAIL || "",
        subject: "UNDERTOWN MESAJ",
        html: `
    <h2>Numele: ${req.body.firstname} ${req.body.lastname} </h2>
    <h2>Email: ${req.body.email} </h2>
    <p>${req.body.message}</p>
  `
    };

    sendgridApi.send(email)
        .then((data) => {
            return res.status(200).json({ message: "Email trimis, cu succes" })
        })
        .catch((err) => {
            console.log("Eroare trimitere email", CONTACT_EMAIL, err);
            return res.status(404).json({ message: "Emailul nu a putut fi trimis" })
        });
};