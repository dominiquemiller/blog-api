process.env.NODE_ENV = "test";

import * as supertest from "supertest";
import * as server from "../../src/server";
import * as dbHelpers from "../db_helpers/db.helper";
const tellJasmineDone = require("jasmine-supertest");
import { UserModel } from "../../src/models/user.model";
import {} from "jasmine";

describe("Blogs Route", () => {

  beforeAll( (done) => {
    // populate DB with users and use one to create blog posts
     dbHelpers.seedModel("User")
      .then( async(value: UserModel) => {
        const posts = await dbHelpers.seedPosts(value._id);
        done();
      });
  });

  afterAll( () => {
    dbHelpers.dropDB();
  });

  it("should return a list of blog posts", (done) => {

    supertest(server).get("/api/blogs")
                     .expect(200)
                     .expect( (res: any) => {
                       if (res.body.length !== 3) throw new Error("Incoreect number of posts returned"); })
                     .end(tellJasmineDone(done));
  });

});