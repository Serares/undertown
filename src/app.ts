import express, { Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import flash from "connect-flash";
import session from "express-session";
import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
// import { AuthRouter } from "./routes/auth";
import ErrorRouter from "./routes/error";
import HomeRouter from "./routes/home";
import { GCS_BUCKET, SESSION_SECRET } from "./utils/secrets";
import { EPropertyTypes } from "./interfaces/EPropertyTypes";


const app = express();

app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: SESSION_SECRET, cookie: { maxAge: 60000 } }));
app.use(flash());

app.use(express.static(path.join(process.cwd(), "dist", "public")));
app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "ejs");

// initiating routes
app.use("/", HomeRouter);
// app.use(authRouter.router);
app.use(ErrorRouter);

// app.use(createProxyMiddleware(
//     "/images",
//     {
//         target: `https://storage.googleapis.com/${GCS_BUCKET}`,
//         changeOrigin: true
//     })
// );

app.use((req, res, next) => {
    // TODO this is added just so views don't crash
    res.locals.isAuthenticated = false;
    res.locals.propertyTypes = Object.values(EPropertyTypes);
    next();
})

app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    if (err.statusCode) {
        res.status(err.statusCode);
    }
    // TODO render error page
    res.send("<p>Error</p>");
})

export default app;
