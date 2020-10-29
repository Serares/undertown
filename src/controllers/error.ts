import { Request, Response, NextFunction } from 'express';

export class ErrorControllers {
    public notFound(req: Request, res: Response, next: NextFunction): void {
        res.status(404).render('pages/404',
            {
                pageTitle: "Not Found",
                path: "", imageUrl: '/img/hero-image.jpg'
            });
    }
}

// exports.get500 = (req, res, next) => {
//     res.status(500).render('500', {
//         pageTitle: 'Error!',
//         path: '/500'
//     });
// }