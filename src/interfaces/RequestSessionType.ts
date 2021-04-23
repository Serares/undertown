import { Request } from "express";

// had to create this interface
// because request object sometimes contains
// a mongo db user schema
export type RequestSessionType = Request & {
    session: any
}
