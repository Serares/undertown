import request from "supertest";
import app from "../src/app";

describe(`GET user /crare-cont`, () => {
    it("Should return 200 for signup page", () => {
        request(app).get("/creare-cont").expect(200)
    })
});

describe(`GET user /autentificare`, () => {
    it("Should return 200 for login page", () => {
        request(app).get("/autentificare").expect(200)
    })
});


describe(`GET user /resetare-parola/:resetToken`, () => {
    it("Should return 200 with a faked token as parameter", () => {
        request(app).get("/resetare-parola/fakeToken").expect(200);
    })
});


describe(`GET user /recuperare-parola`, () => {
    it("Should return 200 for recover password page", () => {
        request(app).get("/recuperare-parola").expect(200);
    })
});
