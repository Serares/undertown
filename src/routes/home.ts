import express, { Express, Router } from "express";
import bodyParser from "body-parser";
import { body, check } from "express-validator";
import { HomeController } from "../controllers/home";

export class HomeRouter {

    private homeController: HomeController = new HomeController();
    private _router = Router();

    constructor() {
        this.config();
        this.initializeRoutes();
    }

    private config(): void {
        this._router.use(bodyParser.json());
        this._router.use(bodyParser.urlencoded({ extended: false }));
    }

    get router(): Router {
        return this._router;
    }

    private initializeRoutes(): void {
        //TODO add the middleware in separate private methods
        this.router.route("/")
            .get(this.homeController.getHomepage)
            .post([
                body("property_status", "Selectează chirii/vânzări")
                    .exists({ checkFalsy: true })
            ], this.homeController.postHomepage);

        // properties
        this._router.get("/inchiriere", this.homeController.getRent);

        this._router.get("/vanzare", this.homeController.getSale);

        this._router.get("/vanzare/:id", this.homeController.getPropertySale);

        this._router.get("/inchiriere/:id", this.homeController.getPropertyRent);

        this._router.get("/contact", this.homeController.getContactpage);

        this._router.get("/about", this.homeController.getAboutpage);

        this._router.post("/properties", this.homeController.properties);

        this._router.post("/send_email", [
            //you can add the checks in an array
            check("email", "Email invalid")
                .isEmail()
                .isLength({ min: 5 }),
            //body checks only in the body of the request
            body(
                "lastname",
                //adding this message as a default .withMessage
                "Nume invalid"
            )
                .isLength({ min: 3 })
                .trim(),
            body(
                "firstname",
                //adding this message as a default .withMessage
                "Nume invalid"
            )
                .isLength({ min: 3 })
                .trim(),
            body("message", "Te rog adauga un mesaj de cel putin 6 caractere")
                .trim()
                .isLength({ min: 6 })
        ], this.homeController.postSendEmail);

    }

}
