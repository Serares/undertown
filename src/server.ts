import { App } from "./app";
import express from "express";

const PORT = process.env.PORT || 5000;
class Server {
    private _app: express.Application = new App().app;

    public startServer(): void {
        this._app.listen(PORT, () => {
            console.log("App is running at http://localhost:" + PORT)
            console.log("  Press CTRL-C to stop\n");
        })
    }
}

const server = new Server();
server.startServer();
