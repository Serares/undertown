import {Request, Response, NextFunction} from 'express';

export const getAboutpage = (req: Request, res: Response, next: NextFunction): void => {
    return res.render("pages/about", {
        path: "/about",
        pageTitle: "Despre Noi",
        middleImageUrl: "/img/about/about_us_middle_image.jpg"
    });
}