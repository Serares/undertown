import {ErrorControllers} from '../controllers/error';
import express from 'express';

export class ErrorRouter{
    private errorControllers: ErrorControllers = new ErrorControllers();

    public routes(app: express.Application): void{
        app.use(this.errorControllers.notFound);
    }

}