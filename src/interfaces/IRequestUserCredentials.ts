import { Request } from "express";


// had to create this interface
// because request object sometimes contains
// a mongo db user schema
export interface IRequestUserCredentials extends Request {
    tokenPayload: {
        exp: number,
        iat: number,
        shortId: string,
        email: string,
        name?: string,
        imagesURL?: string[]
    }
}
