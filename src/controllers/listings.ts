/*
import { getTimeDifferenceEachProperty } from "../utils/getTimeDifference";
import { getProperties } from "../services/getProperties";
import { queriedProperties } from "../services/queryProperties";
import { getSingleProperty } from "../services/getSingleProperty";
import { addDisplayPriceProperties } from "../utils/addDisplayPriceProperties";

public async getRent(req: Request, res: Response, next: NextFunction): Promise<void> {
    // TODO create a class of services that hass all the files as methods
    return getProperties(req, res, next, SEARCH_STATUS.RENT);
}

public async getSale(req: Request, res: Response, next: NextFunction): Promise<void> {
    return getProperties(req, res, next, SEARCH_STATUS.SALE);
}

public async getPropertyRent(req: Request, res: Response, next: NextFunction): Promise<void> {
    //TODO create an enum or an interface for path constants
    const path = "/inchiriere_s";
    return getSingleProperty(req, res, next, path);
}

public async getPropertySale(req: Request, res: Response, next: NextFunction): Promise<void> {
    // TODO path constant
    const path = "/vanzare_s";
    return getSingleProperty(req, res, next, path);
}

public getContactpage(req: Request, res: Response, next: NextFunction): void {
    return res.render("pages/home/contact", {
        path: "/contact",
        pageTitle: "Contact",
        imageUrl: "/img/banner-pages.jpg"
    });
}

public getAboutpage(req: Request, res: Response, next: NextFunction): void {
    return res.render("pages/home/about_us", {
        path: "/about",
        pageTitle: "Despre Noi",
        imageUrl: "/img/hero-image.jpg",
        middleImageUrl: "/img/about/about_us_middle_image.jpg"
    });
}

public async properties(req: Request, res: Response, next: NextFunction): Promise<Response<void> | undefined> {
    //filtrare dupa adresa din filtre
    try {
        // TODO find a logic where you don't need to use null a a parameter
        // doing a sorting only on price, surface and floor
        const dbInformations = await queriedProperties(req, null);
        const properties = JSON.parse(JSON.stringify(dbInformations.properties.slice()));
        const paginationData = dbInformations.paginationData;

        addDisplayPriceProperties(properties);

        if (!properties) {
            const error = new CustomError("Something went wrong");
            error.statusCode = 404;
            error.statusMessage = "Can't find properties when filtering";
            throw error;
        }
        if (properties.length < 1) {
            return res.status(404).json({ message: "No properties found", properties: [] });
        }

        return res.status(200).json(
            {
                message: "Filtered properties",
                properties: JSON.stringify(properties),
                paginationData: JSON.stringify(paginationData)
            });
    } catch (err) {
        if (err.statusCode === 404) {
            console.log(err);
            return res.status(404).json({ message: err.status });
        } else {
            console.log("Got an error line 140:", err);
            const error = new CustomError("Network error");
            error.statusCode = 500;
            error.statusMessage = "Server error";
            next(error);
        }
    }
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

}

*/