import { NextFunction, Response, Router } from 'express';
import { blockNotAuthenticatedAndNotAdmin } from '../middleware/isAuth';
import serveStatic from 'serve-static';
import path from 'path';
import { uploadImages } from '../middleware/imagesUpload';
import bodyParser from 'body-parser';
import { AdminController } from '../controllers/admin';
import { IRequestUserCredentials } from '../interfaces/IRequestUserCredentials';


export class AdminRouter {
    // TODO try to create a Interface or Abstract class for Router 
    // TODO create interface for controller, try to abstractize the controller property
    private _router: Router = Router();
    private controller: AdminController = new AdminController();

    constructor() {
        this.config();
        this.initializeRoutes();
    }

    get router(): Router {
        return this._router;
    }

    private initializeRoutes(): void {
        try {
            this._router.get('/createProperties/:number', this.controller.createProperties);
            //here we are configuring build to serve app files
            this._router.use('/', this.blockNotAuthenticatedAdmin, serveStatic(path.join(__dirname, '../admin_page/build')));

            // TODO add the upload in a file in middleware folder
            this._router.post('/postAddProperty',
                uploadImages,
                (req: IRequestUserCredentials | any, res, next) => {
                    this.controller.postAddProperty(req, res, next)
                });

            this._router.get('/getAllProperties', this.controller.getAllProperties);

            this._router.delete('/deleteProperty/:id', this.controller.deleteProperty);

            this._router.put('/changeProperty', this.controller.changeProperty);

            // this._router.get('/submitedProperties', this.controller.getSubmitedProperties);

            this._router.get('/get_admin_accounts', this.controller.getAdminAccounts);

            this._router.get('/get_property_form_fields', this.controller.getPropertyFormFields);

            // this * route is to serve project on different page routes except root `/`
            this._router.get(/.*/, function (req, res) {
                console.log("dirname", __dirname);
                res.sendFile(path.join(__dirname, '../admin_page/build/index.html'))
            });
        } catch (err) {
            console.log("error", err);
        }

    }

    private blockNotAuthenticatedAdmin(req: IRequestUserCredentials | any, res: Response, next: NextFunction) {
        return blockNotAuthenticatedAndNotAdmin(req, res, next);
    }

    private config(): void {
        this._router.use(bodyParser.json());
    }
}