import app from "./app";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log("App is running at http://localhost:" + PORT);
    console.log("  Press CTRL-C to stop\n");
});

export default server;
