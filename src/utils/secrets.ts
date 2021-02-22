import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.debug(".env file does not exist");
}
export const ENVIRONMENT = process.env.NODE_ENV;
// environment will be overriten by launch.json in vscode debug
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const MONGO_DB = prod ? process.env["MONGO_DB"] : process.env["MONGO_DB_DEV"];
export const MONGO_DB_SESSION_DB = process.env["MONGO_DB_SESSION_DB"];
export const GCS_BUCKET = prod ? process.env["GCLOUD_BUCKET_PROD"] : process.env["GCLOUD_BUCKET_DEV"];

if (!SESSION_SECRET) {
    logger.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}

if (!MONGO_DB) {
    if (prod) {
        logger.error("No mongo connection string. Set MONGODB_DB environment variable.");
    } else {
        logger.error("No mongo connection string. Set MONGODB_DB_DEV environment variable.");
    }
    process.exit(1);
}
