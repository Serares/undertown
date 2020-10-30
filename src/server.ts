import { App } from './app';
import mongoose from "mongoose";
import express from 'express';

const PORT = process.env.PORT || 5000;


class Server {
    private _expressApp: express.Application;
    private _classApp: App;

    constructor(app: App) {
        this._expressApp = app.app;
        this._classApp = app;
    }

    public startServer(): void {
        // add here the connection to mongo and the server start
        mongoose.connect(this._classApp.MongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(response => {
                console.log("CONNECTED TO DB");
                this._expressApp.listen(PORT, () => console.log(`Listening on ${PORT}`));
            })
            .catch(error => {
                console.log(error);
            });
    }
}

let server = new Server(new App());
server.startServer();
