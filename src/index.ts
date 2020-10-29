import express, { Request, Response, NextFunction } from 'express';

import path from 'path';
const PORT = process.env.PORT || 5000;
import mongoose from 'mongoose';
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';
import { User } from './models/user';
import flash from 'connect-flash';
// TODO create this module in TS
const s3proxy = require('s3-proxy');
// const morgan = require('morgan');
const helmet = require('helmet');
//
import compression from 'compression';
import { AuthRouter } from './routes/auth';
import { ErrorRouter } from './routes/error';
import { HomeRouter } from './routes/home';
import { AdminRouter } from './routes/admin';

//TODO implement Jest testing
// TODO create a test cluster on mongoDB: so when developing , you don't have to use the actual DB
class App {
    public app: express.Application;
    private MongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-xyshh.mongodb.net/${process.env.MONGO_DB}`;
    // TODO read how mongoDbStore works exactly
    private _mongoDBStore = MongoDBStore(session);
    private store: any;
    private errorRouter: ErrorRouter = new ErrorRouter();
    private homeRouter: HomeRouter;
    private adminRouter: AdminRouter;
    private authRouter: AuthRouter;

    constructor() {
        this.app = express();
        this.homeRouter = new HomeRouter();
        this.adminRouter = new AdminRouter();
        this.authRouter = new AuthRouter();
        this.config();
        // setting the communication with database and session
        this.store = new this._mongoDBStore({
            uri: this.MongoURI,
            collection: 'sessions'
        });

        // initiating routes
        //pagina de admin cred ca va deveni un api separat
        this.app.use(this.homeRouter.router);
        this.app.use(this.adminRouter.router);
        this.app.use(this.authRouter.router);
        this.errorRouter.routes(this.app);
    }

    private config(): void {
        let tomorrowDate = new Date();
        tomorrowDate.setDate(new Date().getDate() + 1);
        // use plug-ins for the app
        //configuration for sessions and cookies
        //TODO make all callback functions private methods
        // private session: void {}
        this.app.use(session({
            secret: 'MySecret',
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

        this.app.use((req: Request, res: Response, next: NextFunction) => {
            //DON'T FORGET TO UNCOMMENT THIS IN PRODUCTION
            //TODO set admin page in a separate URL and use the cors stuff only for MVC
            //this does not send a response just sets a Header
            // you can lock cors to one domain 'exampledomain.com'
            // res.setHeader('Access-Control-Allow-Origin', '*');
            // res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
            // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });

        this.app.get('/images/*', s3proxy({
            bucket: process.env.S3_BUCKET,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            overrideCacheControl: 'max-age=2592000'
        }));

        // upload login moved to routes because it acts as a middleware
        // app.use(multer({ storage: fileStorage, fileFilter: fileFilter}).array('imagini', 10));
        console.log("Directory name is:", process.cwd());
        this.app.use(express.static(path.join(process.cwd(), 'public')));
        this.app.set('views', path.join(process.cwd(), 'views'));
        this.app.set('view engine', 'ejs');

        this.app.use(helmet());
        this.app.use(compression());

        this.app.use(flash());
        //TODO define Types for parameters
        this.app.use((req: any, res, next) => {
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
        this.app.use((req: any, res: Response, next: NextFunction) => {
            //if there is no authentication then just ignore this middleware return next()
            if (!req.session.user) {
                return next()
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




        this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
            console.log("Error", error);
            // res.status(500).render('500', {
            //     pageTitle: 'Error!',
            //     path: '/500',
            //     isAuthenticated: false
            // });
            res.status(error.statusCode).json({ message: "Erorare", error: error });
        });
    }

    public startServer(): void {
        // add here the connection to mongo and the server start
        mongoose.connect(this.MongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(response => {
                console.log("CONNECTED TO DB");
                this.app.listen(PORT, () => console.log(`Listening on ${PORT}`));
            })
            .catch(error => {
                console.log(error);
            })
    }
}

let app = new App();
app.startServer();
