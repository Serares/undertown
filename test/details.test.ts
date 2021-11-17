import request from "supertest";
import app from "../src/app";
import { TransactionTypes, PropertyTypes } from "../src/modelView/values";
import { DB_API_URL } from '../src/utils/secrets';
/*
// describe(`GET single_page; details /chirii-:propertyType`, () => {
//     it("Should return 200 for apartments with fake id", (done) => {
//         request(app).get(`/${TransactionTypes.RENT.endpoint}-${PropertyTypes.APARTMENTS.endpoint}/fakeId`).expect(200, done);
//     });
//     it("Should return 200 for houses with fake id", (done) => {
//         request(app).get(`/${TransactionTypes.RENT.endpoint}-${PropertyTypes.HOUSE.endpoint}/fakeId`).expect(200, done);
//     });
//     it("Should return 200 for lands", (done) => {
//         request(app).get(`/${TransactionTypes.RENT.endpoint}-${PropertyTypes.LAND.endpoint}/fakeId`).expect(200, done);
//     });
// });


// describe(`GET details /vanzare-:propertyType`, () => {
//     it("Should return 200 for apartments with fake id", (done) => {
//         request(app).get(`/${TransactionTypes.SALE.endpoint}-${PropertyTypes.APARTMENTS.endpoint}/fakeId`).expect(200, done);
//     });
//     it("Should return 200 for houses with fake id", (done) => {
//         request(app).get(`/${TransactionTypes.SALE.endpoint}-${PropertyTypes.HOUSE.endpoint}/fakeId`).expect(200, done);
//     });
//     it("Should return 200 for lands with fake id", (done) => {
//         request(app).get(`/${TransactionTypes.SALE.endpoint}-${PropertyTypes.LAND.endpoint}/fakeId`).expect(200, done);
//     });
// });
*/

describe(`GET single_page_details /chirii-:propertyType`, () => {
    it("Should return 404 for apartments with fake id", (done) => {
        request(app).get(`/${TransactionTypes.RENT.endpoint}-${PropertyTypes.APARTMENTS.endpoint}/fakeId`).expect(404, (err, res) => {
            if (err) {
                console.log("API URL ->", DB_API_URL);
                console.log("ENVIRONMENT ->", process.env.NODE_ENV);
                return done(err);
            }
            return done();
        });
    });
    it("Should return 404 for houses with fake id", (done) => {
        request(app).get(`/${TransactionTypes.RENT.endpoint}-${PropertyTypes.HOUSE.endpoint}/fakeId`).expect(404, done);
    });
    it("Should return 404 for lands", (done) => {
        request(app).get(`/${TransactionTypes.RENT.endpoint}-${PropertyTypes.LAND.endpoint}/fakeId`).expect(404, done);
    });
});
