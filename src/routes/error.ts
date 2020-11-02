import { ErrorControllers } from "../controllers/error";
import express, { Router } from "express";

export class ErrorRouter {
    private _controller: ErrorControllers = new ErrorControllers();
    private _router = Router();
    constructor() {
        this.initializeRoutes();
    }
    get router() {
        return this._router;
    }
    private initializeRoutes(): void {
        this._router.get("*", this._controller.notFound);
    }

}