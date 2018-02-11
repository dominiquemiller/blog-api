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
    const user = await dbHelpers.seedModel("User");
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
    const jwt = await userJwt(user);
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

  it("PATCH should update a blog post with a valid user", async(done) => {
    const user = await getUser();
    const jwt = await userJwt(user);
    const post = await dbHelpers.getAPost();

    const payload = { title: "my updated post title", body: post.body };

    supertest(server).post(`/api/blogs/${post._id}`)
                     .set("Authorization", `JWT ${jwt.token}`)
                     .send(payload)
                     .expect(200)
                     .expect( (res: any) => {
                      if (res.body.ok !== 1) throw new Error("Update unsuccessful");
                     })
                     .end(tellJasmineDone(done));

  });

  it("should return a blog post by id", async (done) => {
    const blogPost = await dbHelpers.getAPost();

    supertest(server).get(`/api/blogs/${blogPost._id}`)
                     .expect(200)
                     .expect( (res: any) => {
                       const post = res.body;
                       if (post.title !== blogPost.title) throw new Error("Incorrect post returned");
                     })
                     .end(tellJasmineDone(done));
  });

});