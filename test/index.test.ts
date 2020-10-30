import request from "supertest";
import { App } from "../src/app";
const app = new App();
// TODO
/**
 * separate the logic from most of the methods
 * this way it's easier to test and it creates a lot of abstraction
 */
describe("GET /", () => {
    it("Should get the main page", (done) => {
        request(app.app).get("/")
            .expect(200, done);
    });
});

describe("GET ERROR", () => {
    it("Should get the main page", (done) => {
        
    });
});
