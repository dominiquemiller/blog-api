process.env.NODE_ENV = "test";
process.env.PORT = "5555";

import * as supertest from "supertest";
import * as server from "../../src/server";
import * as dbHelpers from "../db_helpers/db.helper";
const tellJasmineDone = require("jasmine-supertest");
import {} from "jasmine";

describe("Login Routes", () => {
  beforeAll( (done) => {
     dbHelpers.seedModel("User")
      .then( (value: any) => {
        if (value) done();
      });
  });

  afterAll( () => {
    dbHelpers.dropDB();
  });

  it("should return 401 unauthorized with bad password", (done) => {
    const login = { "email": "dom@trimagency.com", "password": "fakepassword" };

    supertest(server).post("/api/login")
                     .send(login)
                     .expect(401)
                     .expect((res: any) => { console.log(res.body); })
                     .end(tellJasmineDone(done));
  });

  it("should return JWT with correct password", (done) => {
    const login = { "email": "dom@trimagency.com", "password": "password" };

    supertest(server).post("/api/login")
                     .send(login)
                     .expect(201)
                     .expect((res: any) => { console.log(res.body); })
                     .end(tellJasmineDone(done))
  });
  
});