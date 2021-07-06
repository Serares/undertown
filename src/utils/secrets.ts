import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";
// TODO clean .env file for production
let envFile;
if (fs.existsSync(".env")) {
    logger.debug("Using .env file if in production");
    dotenv.config({ path: ".env" });
    if (process.env.NODE_ENV.toLowerCase() === "test") {
        const data = fs.readFileSync(".env");
        envFile = dotenv.parse(data);
    }
} else {
    logger.debug(".env file does not exist");
};

export const ENVIRONMENT = process.env.NODE_ENV.toLowerCase() === "test" ? envFile.NODE_ENV : process.env.NODE_ENV;
// environment will be overriten by launch.json in vscode debug
const prod = ENVIRONMENT.toLowerCase() === "production"; // Anything else is treated as 'dev'
logger.debug("ENVIRONMENT IS: " + ENVIRONMENT);

export const TOKEN_SECRET = process.env["TOKEN_SECRET"];
export const MONGO_DB = prod ? process.env["MONGO_DB"] : process.env["MONGO_DB_DEV"];
export const GCS_BUCKET = prod ? process.env["GCLOUD_BUCKET_PROD"] : process.env["GCLOUD_BUCKET_DEV"];
export const SENDGRID_API_KEY = process.env["SENDGRID_API_KEY"];
export const CONTACT_EMAIL = prod ? process.env["PROD_EMAIL"] : process.env["DEV_EMAIL"];
export const DB_API_URL = prod ? process.env["DB_API_PROD"] : process.env["DB_API_DEV"];
export const GCLOUD_PROJECT_ID = process.env["GCLOUD_PROJECT_ID"];

if (!TOKEN_SECRET) {
    logger.error("No client secret. Set TOKEN_SECRET environment variable.");
    process.exit(1);
}

