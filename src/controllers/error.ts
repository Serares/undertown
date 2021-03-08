import { Request, Response, NextFunction } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
    res.status(404).render("pages/404",
        {
            pageTitle: "Not Found",
            path: "", imageUrl: "/img/hero-image.jpg"
        });
}
