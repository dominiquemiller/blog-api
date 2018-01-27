process.env.NODE_ENV = "test";

import * as supertest from "supertest";
import * as server from "../../src/server";
import * as dbHelpers from "../helpers/db.helper";
const tellJasmineDone = require("jasmine-supertest");
import {} from "jasmine";

describe("Account Route", () => {

  it("POST should create a new account for a user", (done) => {

    const payload = { name: "John Doe", email: "john@doe.com", password: "password" };

    supertest(server).post("/api/account")
                     .send(payload)
                     .expect(201)
                     .expect( (res: any) => {
                       const data = res.body;
                       if (data.email !== payload.email && data.message !== "ok") {
                         throw new Error("New user not created");
                       }
                     })
                     .end(tellJasmineDone(done));

  });

});