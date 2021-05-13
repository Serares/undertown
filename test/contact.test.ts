import request from "supertest";
import app from "../src/app";
import { expect } from "chai";

describe(`GET contact /contact`, () => {
    it("Should return 200", () => {
        request(app).get("/contact").expect(200)
    })
});

describe("POST /send_email", () => {
    it("should return false from assert when email is not email", (done) => {
        request(app).post("/send_email")
            .field("name", "John Cena")
            .field("email", "john")
            .expect(422)
            .end(function (err, res) {
                expect(res.error).not.to.be.undefined;
                done();
            });
    });
});
