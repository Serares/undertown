import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";
// TODO clean .env file for production

if (fs.existsSync(".env")) {
    logger.debug("Using .env file if in production");
    dotenv.config({ path: ".env" });
} else {
    logger.debug(".env file does not exist");
}
export const ENVIRONMENT = process.env.NODE_ENV;
// environment will be overriten by launch.json in vscode debug
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'
logger.debug("ENVIRONMENT IS: " + process.env.NODE_ENV);

export const TOKEN_SECRET = process.env["TOKEN_SECRET"];
export const MONGO_DB = prod ? process.env["MONGO_DB"] : process.env["MONGO_DB_DEV"];
export const MONGO_DB_SESSION_DB = process.env["MONGO_DB_SESSION_DB"];
export const GCS_BUCKET = prod ? process.env["GCLOUD_BUCKET_PROD"] : process.env["GCLOUD_BUCKET_DEV"];
export const SENDGRID_API_KEY = process.env["SENDGRID_API_KEY"];
export const CONTACT_EMAIL = prod ? process.env["PROD_EMAIL"] : process.env["DEV_EMAIL"];

if (!TOKEN_SECRET) {
    logger.error("No client secret. Set TOKEN_SECRET environment variable.");
    process.exit(1);
}

