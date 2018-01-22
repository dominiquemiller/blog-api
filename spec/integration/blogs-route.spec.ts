process.env.NODE_ENV = "test";

import * as supertest from "supertest";
import * as server from "../../src/server";
import * as dbHelpers from "../helpers/db.helper";
const tellJasmineDone = require("jasmine-supertest");
import { UserModel, default as User } from "../../src/models/user.model";
import {} from "jasmine";
import { userJwt, getUser } from "../helpers/auth_helpers";

describe("Blogs Route", () => {

  beforeAll( async (done) => {
    // seed test DB with users and store returned user
    const user = await dbHelpers.seedModel("User");
    // seed test DB with posts authored by const user
    const posts = await dbHelpers.seedPosts(user._id);
    done();
  });

  afterAll( () => {
    dbHelpers.dropDB();
  });

  it("GET should return a list of blog posts", (done) => {

    supertest(server).get("/api/blogs")
                     .expect(200)
                     .expect( (res: any) => {
                       if (res.body.length !== 3) throw new Error("Incoreect number of posts returned"); })
                     .end(tellJasmineDone(done));
  });

  it("POST should create a new blog post with a valid user", async (done) => {
    const user = await getUser();
    const jwt = await userJwt();
    const blogPost = { "author": user._id, "title": "Fantastic blog ideas", "body": "i have no ideas" };

    supertest(server).post("/api/blogs")
                     .set("Authorization", `JWT ${jwt.token}`)
                     .send(blogPost)
                     .expect(200)
                     .expect( (res: any) => {
                       if ( res.body.title !== blogPost.title ) throw new Error("Wrong title returned");
                       if ( res.body.body !== blogPost.body ) throw new Error("Wrong body returned");
                      })
                     .end(tellJasmineDone(done));
  });

});