import express, { Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import flash from "connect-flash";
import session from "express-session";
import helmet from "helmet";
import compression from "compression";
// import { AuthRouter } from "./routes/auth";
import ErrorRouter from "./routes/error";
import homeRouter from "./routes/home";
import listingRouter from "./routes/listing";
import detailsRouter from './routes/details';
import aboutRouter from "./routes/about";

import { GCS_BUCKET, SESSION_SECRET } from "./utils/secrets";
import { PropertyTypes, TransactionTypes } from "./modelView/values";

const app = express();

app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(process.cwd(),"dist","public")));

app.use(session({ secret: SESSION_SECRET, cookie: { maxAge: 60000 } }));
app.use(flash());

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(createProxyMiddleware(
//     "/images",
//     {
//         target: `https://storage.googleapis.com/${GCS_BUCKET}`,
//         changeOrigin: true
//     })
// );

app.use((req: Request, res: Response, next: NextFunction) => {
    // TODO this is added just so views don't crash
    res.locals.isAuthenticated = false;
    res.locals.propertyTypes = Object.entries(PropertyTypes);
    res.locals.transactionTypes = Object.entries(TransactionTypes);
    res.locals.bannerImageUrl = "/img/hero-image.jpg";
    next();
});

// TODO add error handler to error controller
// app.use((err: any, req: any, res: any, next: any) => {
//     console.error(err);
//     if (err.statusCode) {
//         res.status(err.statusCode);
//     }
//     if (process.env.NODE_ENV === "development") {
//         res.send(err);
//     } else {
//         res.send("<p>Error</p>");
//     }
// })

// initiating routes
app.use(detailsRouter);
app.use(listingRouter);
app.use(aboutRouter);
// app.use(authRouter.router);
app.use("/", homeRouter);
app.use(ErrorRouter);



export default app;
