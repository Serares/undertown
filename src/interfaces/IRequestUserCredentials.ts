import { Request } from "express";
import {IUser} from "./IUser";


// had to create this interface
// because request object sometimes contains
// a mongo db user schema
export interface IRequestUserCredentials extends Request {
    user: IUser
}
