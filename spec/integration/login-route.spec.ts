process.env.NODE_ENV = "test";

import * as supertest from "supertest";
import * as server from "../../src/server";
import * as dbHelpers from "../helpers/db.helper";
const tellJasmineDone = require("jasmine-supertest");
import {} from "jasmine";

describe("Login Route", () => {
  beforeAll( async (done) => {
    const user = await dbHelpers.seedModel("User");
    done();
  });

  afterAll( () => {
    dbHelpers.dropDB();
  });

  it("should return 401 unauthorized with bad password", (done) => {
    const login = { "email": "dom@trimagency.com", "password": "fakepassword" };

    supertest(server).post("/api/login")
                     .send(login)
                     .expect(401)
                     .expect((res: any) => {
                        if (res.body.message !== "Password does not match") throw new Error("Incorrect error message");
                      })
                     .end(tellJasmineDone(done));
  });

  it("should return 401 unauthorized when email not found", (done) => {
    const login = { "email": "fake@email.com", "password": "fakepassword" };

    supertest(server).post("/api/login")
                     .send(login)
                     .expect(401)
                     .expect((res: any) => {
                        if (res.body.message !== "User not found") throw new Error("Incorrect error message");
                      })
                     .end(tellJasmineDone(done));
  });

  it("should return JWT with correct password", (done) => {
    const login = { "email": "dom@trimagency.com", "password": "password" };

    supertest(server).post("/api/login")
                     .send(login)
                     .expect(201)
                     .expect((res: any) => {
                       if (!res.body.token) throw new Error("Token not returned");
                      })
                     .end(tellJasmineDone(done));
  });
  
});