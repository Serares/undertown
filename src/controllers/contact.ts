/*
export const getContactpage = (req: Request, res: Response, next: NextFunction): void => {
    return res.render("pages/home/contact", {
        path: "/contact",
        pageTitle: "Contact",
        imageUrl: "/img/banner-pages.jpg"
    });
}

public postSendEmail(req: Request, res: Response, next: NextFunction): Response<void> | void {
    // check if there are errors and display 'em
    // send data back with the fields that need to be highlighted red
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).json({ error: errors });
    }
    // if there is no contactPerson(single_property) then use the default email ( contact page )
    const RECIVER_EMAIL = req.body["CONTACT_PERSON_EMAIL"] || process.env.DEFAULT_EMAIL;
    console.log("Reciver email", RECIVER_EMAIL);
    // TODO create an object for this message
    const email = {
        to: RECIVER_EMAIL,
        from: process.env.FROM_EMAIL || "",
        subject: "UNDERTOWN MESAJ",
        html: `
    <h2>Numele: ${req.body.firstname} ${req.body.lastname} </h2>
    <h2>Email: ${req.body.email} </h2>
    <p>${req.body.message}</p>
  `
    };
    */