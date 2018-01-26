process.env.NODE_ENV = "test";

import * as supertest from "supertest";
import * as server from "../../src/server";
import * as dbHelpers from "../helpers/db.helper";
const tellJasmineDone = require("jasmine-supertest");
import {} from "jasmine";

describe("Comment Route", () => {
  beforeAll( async (done) => {
    const user = await dbHelpers.seedModel("User");
    const posts = await dbHelpers.seedPosts(user._id);
    done();
  });

  afterAll( () => {
    dbHelpers.dropDB();
  });

  it("should create a comment and attach to blog post", async(done) => {
    const post = await dbHelpers.getAPost();
    const payload = { post_id: post._id, email: "user@test.com", body: "i am very happy to comment!" };

    supertest(server).post("/api/comment")
                     .send(payload)
                     .expect(200)
                     .expect( (res: any) => {
                       if (res.body.ok !== 1) throw new Error("Error creating your comment");
                     })
                     .end(tellJasmineDone(done));
  });

});