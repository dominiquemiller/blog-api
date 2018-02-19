process.env.NODE_ENV = "test";

import * as supertest from "supertest";
import * as server from "../../src/server";
import * as dbHelpers from "../helpers/db.helper";
const tellJasmineDone = require("jasmine-supertest");
import {} from "jasmine";

describe("Category route", () => {

  beforeAll( async (done) => {
    const user = await dbHelpers.seedModel("User");
    const categories = await dbHelpers.seedModel("Categories");
    const posts = await dbHelpers.seedPosts(user._id);
    done();
  });

  afterAll( () => {
    dbHelpers.dropDB();
  });

  it("GET should return a list of categories", (done) => {

    supertest(server).get("/api/categories")
                     .expect(200)
                     .expect( (res: any) => {
                       if (res.body.length !== 4) throw new Error("Incoreect number of posts returned"); })
                     .end(tellJasmineDone(done));
  });

});