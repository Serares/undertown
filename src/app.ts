import express, { Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import helmet from "helmet";
import compression from "compression";
import ErrorRouter from "./routes/error";
import homeRouter from "./routes/home";
import listingRouter from "./routes/listing";
import detailsRouter from './routes/details';
import aboutRouter from "./routes/about";
import contactRouter from './routes/contact';
import userRouter from './routes/user';
import { GCS_BUCKET } from './utils/secrets';

import { PropertyTypes, TransactionTypes } from "./modelView/values";
import logger, { timeNow } from "./utils/logger";

const app = express();

app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(), "dist", "public")));

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.propertyTypes = Object.entries(PropertyTypes);
    res.locals.transactionTypes = Object.entries(TransactionTypes);
    res.locals.bannerImageUrl = "/img/hero-image.jpg";
    res.locals.baseImageUrl = `https://storage.googleapis.com/${GCS_BUCKET}/`;
    next();
});

// TODO add error handler to error controller
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    logger.debug(`${err} -> ${timeNow}`);
    if (err.statusCode) {
        res.status(err.statusCode);
    }
    if (process.env.NODE_ENV === "development") {
        res.send(err);
    } else {
        res.send("<p>Error occured please refresh the page</p>");
    }
})

// initiating routes
app.use(detailsRouter);
app.use(listingRouter);
app.use(aboutRouter);
app.use(contactRouter);
app.use(userRouter);
app.use("/", homeRouter);
app.use(ErrorRouter);



export default app;
