import { Request } from 'express';

type AuthenticatedUser = {
    tokenPayload: any
}

export type RequestTokenPayload = Request & {
    user: AuthenticatedUser
}