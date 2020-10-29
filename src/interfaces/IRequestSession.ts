import { Request } from "express";
import { IRequestUserCredentials } from "./IRequestUserCredentials";

// had to create this interface
// because request object sometimes contains
// a mongo db user schema
export interface IRequestSession extends Request, IRequestUserCredentials {
    session: Express.Session
}