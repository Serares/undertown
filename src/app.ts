import express, { Request, Response, NextFunction } from "express";

import path from "path";
import session from "express-session";
import MongoDBStore from "connect-mongodb-session";
import { User } from "./models/user";
import flash from "connect-flash";
// TODO create this module in TS
import s3proxy from "s3-proxy";
import helmet from "helmet";
//
import compression from "compression";
import { AuthRouter } from "./routes/auth";
import { ErrorRouter } from "./routes/error";
import { HomeRouter } from "./routes/home";
import { AdminRouter } from "./routes/admin";
import { MONGO_DB } from "./utils/secrets";

//TODO implement Jest testing
// TODO create a test cluster on mongoDB: so when developing , you don't have to use the actual DB
export class App {
    // TODO use the underline convention for private properties
    private _app: express.Application;
    private _MongoURI: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-xyshh.mongodb.net/${MONGO_DB}`;
    // TODO read how mongoDbStore works exactly
    private _mongoDBStore = MongoDBStore(session);
    private store: any;
    private errorRouter: ErrorRouter = new ErrorRouter();
    private homeRouter: HomeRouter;
    private adminRouter: AdminRouter;
    private authRouter: AuthRouter;

    get app(): express.Application {
        return this._app;
    }

    get MongoURI(): string{
        return this._MongoURI;
    }

    constructor() {
        this._app = express();
        this.homeRouter = new HomeRouter();
        this.adminRouter = new AdminRouter();
        this.authRouter = new AuthRouter();
        this.config();
        // setting the communication with database and session
        this.store = new this._mongoDBStore({
            uri: this._MongoURI,
            collection: "sessions"
        });

        // initiating routes
        //pagina de admin cred ca va deveni un api separat
        this._app.use(this.homeRouter.router);
        this._app.use(this.adminRouter.router);
        this._app.use(this.authRouter.router);
        this.errorRouter.routes(this._app);
    }

    private config(): void {
        const tomorrowDate = new Date();
        tomorrowDate.setDate(new Date().getDate() + 1);
        // use plug-ins for the app
        //configuration for sessions and cookies
        //TODO make all callback functions private methods
        // private session: void {}
        this._app.use(session({
            secret: process.env.SESSION_SECRET,
            cookie: {
                maxAge: 1000 * 60 * 90,
                // SOLVED A BUG HERE
                // without TS i would add a number, and the sessions would expire after a very long time
                expires: tomorrowDate
            },
            resave: false,
            saveUninitialized: false,
            store: this.store
        }));

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

        this._app.get("/images/*", s3proxy({
            bucket: process.env.S3_BUCKET,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            overrideCacheControl: "max-age=2592000"
        }));

        // upload login moved to routes because it acts as a middleware
        // app.use(multer({ storage: fileStorage, fileFilter: fileFilter}).array('imagini', 10));
        this._app.use(express.static(path.join(process.cwd(), "dist", "public")));
        this._app.set("views", path.join(process.cwd(), "views"));
        this._app.set("view engine", "ejs");

        this._app.use(helmet());
        this._app.use(compression());

        this._app.use(flash());
        //TODO define Types for parameters
        this._app.use((req: any, res, next) => {
            let userStatus = null;
            if (req.session.user) {
                userStatus = req.session.user.status;
            }
            // all rendered views get those variables
            res.locals.isAuthenticated = req.session.isLoggedIn;
            res.locals.userStatus = userStatus;
            next();
        });

        //we need to add this middleware
        //TODO create the callback function as a middleware method
        //TODO I have to define a request Interface that has session object
        this._app.use((req: any, res: Response, next: NextFunction) => {
            //if there is no authentication then just ignore this middleware return next()
            if (!req.session.user) {
                return next();
            }
            // if there is a user in session then get it's ID and add it in req.user so we can use it's mongoose object with all methods
            User.findById(req.session.user._id)
                .then(user => {
                    if (!user) {
                        return next();
                    }
                    req.user = user;
                    next();
                })
                .catch(err => console.log(err));
        });




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
