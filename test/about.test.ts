import request from "supertest";
import app from "../src/app";

describe(`GET about /despre`, () => {
    it("Should return 200", () => {
        request(app).get("/despre").expect(200)
    })
});
