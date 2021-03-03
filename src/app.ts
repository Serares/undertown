import express, { Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import flash from "connect-flash";
import helmet from "helmet";
import compression from "compression";
// import { AuthRouter } from "./routes/auth";
import { ErrorRouter } from "./routes/error";
import { HomeRouter } from "./routes/home";
import { GCS_BUCKET } from "./utils/secrets";

//TODO implement Jest testing
export class App {
    private _app: express.Application;
    private errorRouter: ErrorRouter = new ErrorRouter();
    private homeRouter: HomeRouter;
    // private authRouter: AuthRouter;

    get app(): express.Application {
        return this._app;
    }

    constructor() {
        this._app = express();
        this.homeRouter = new HomeRouter();
        // this.authRouter = new AuthRouter();
        this.config();
        
        // initiating routes
        this._app.use("/",this.homeRouter.router);
        // this._app.use(this.authRouter.router);
        this._app.use(this.errorRouter.router);
    }

    private config(): void {

        this._app.use((req: Request, res: Response, next: NextFunction) => {
            //DON'T FORGET TO UNCOMMENT THIS IN PRODUCTION
            //TODO set admin page in a separate URL and use the cors stuff only for MVC
            //this does not send a response just sets a Header
            // you can lock cors to one domain 'exampledomain.com'
            // res.setHeader('Access-Control-Allow-Origin', '*');
            // res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
            // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });

        // TODO create a proxy to serve files like s3 proxy
        this._app.use(createProxyMiddleware(
            "/images",
            {
                target: `https://storage.googleapis.com/${GCS_BUCKET}`,
                changeOrigin: true
            })
        );

        // upload login moved to routes because it acts as a middleware
        // app.use(multer({ storage: fileStorage, fileFilter: fileFilter}).array('imagini', 10));
        this._app.use(express.static(path.join(process.cwd(), "dist", "public")));
        this._app.set("views", path.join(process.cwd(), "views"));
        this._app.set("view engine", "ejs");

        this._app.use(helmet());
        this._app.use(compression());

        this._app.use(flash());

        // TODO add this error handler in error controller
        this._app.use((error: any, req: Request, res: Response, next: NextFunction) => {
            console.log("Error", error);
            // res.status(500).render('500', {
            //     pageTitle: 'Error!',
            //     path: '/500',
            //     isAuthenticated: false
            // });
            res.status(error.statusCode).json({ message: "Erorare", error: error });
        });
    }

}
