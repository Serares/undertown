import request from "supertest";
import app from "../src/app";
import { TransactionTypes, PropertyTypes } from "../src/modelView/values";

describe(`GET Listings /chirii-:propertyType`, () => {
    it("Should return 200 for apartments", (done) => {
        request(app).get(`/${TransactionTypes.RENT.endpoint}-${PropertyTypes.APARTMENTS.endpoint}`).expect(200, done);
    });
    it("Should return 200 for houses", (done) => {
        request(app).get(`/${TransactionTypes.RENT.endpoint}-${PropertyTypes.HOUSE.endpoint}`).expect(200, done);
    });
    it("Should return 200 for lands", (done) => {
        request(app).get(`/${TransactionTypes.RENT.endpoint}-${PropertyTypes.LAND.endpoint}`).expect(200, done);
    });
});

describe(`GET Listings /vanzare-:propertyType`, () => {
    it("Should return 200 for apartments", (done) => {
        request(app).get(`/${TransactionTypes.SALE.endpoint}-${PropertyTypes.APARTMENTS.endpoint}`).expect(200, done);
    });
    it("Should return 200 for houses", (done) => {
        request(app).get(`/${TransactionTypes.SALE.endpoint}-${PropertyTypes.HOUSE.endpoint}`).expect(200, done);
    });
    it("Should return 200 for lands", (done) => {
        request(app).get(`/${TransactionTypes.SALE.endpoint}-${PropertyTypes.LAND.endpoint}`).expect(200, done);
    });
});


describe(`GET Listings /RANDOM-URL`, () => {
    it("Should return 404 for apartments", (done) => {
        request(app).get(`/${TransactionTypes.SALE.endpoint}-${10}`).expect(404, done);
    });
});
