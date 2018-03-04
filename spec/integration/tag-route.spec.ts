process.env.NODE_ENV = "test";

import * as supertest from "supertest";
import * as server from "../../src/server";
import * as dbHelpers from "../helpers/db.helper";
const tellJasmineDone = require("jasmine-supertest");
import {} from "jasmine";
import { userJwt, getUser } from "../helpers/auth_helpers";
import { default as Post, PostModel } from "../../src/models/post.model";
import { Tag, TagModel } from "../../src/models/tag.model";

describe("Tag route", () => {

  beforeAll( async (done) => {
    const user = await dbHelpers.seedModel("User");
    const tags = await dbHelpers.seedModel("Tags");
    const posts = await dbHelpers.seedPosts(user._id);
    done();
  });

  afterAll( () => {
    dbHelpers.dropDB();
  });

  it("GET should return a list of tags", (done) => {

    function countCheck(docArray: Array<any>) {
       return docArray.every( (value: any, index: number) => {
        return value.count === 0;
      });
    }

    supertest(server).get("/api/tags")
                     .expect(200)
                     .expect( (res: any) => {
                       if (res.body.length !== 4) throw new Error("Incoreect number of posts returned");
                       if (!countCheck(res.body)) throw new Error("Incorrect count of posts for each category");
                     })
                     .end(tellJasmineDone(done));
  });

  it("GET should return a tag", async(done) => {
    const tag = await Tag.findOne({ title: "Ruby" });

    supertest(server).get(`/api/tags/${tag._id}`)
                     .expect(200)
                     .expect( (res: any) => {
                       if (res.body.title !== "Ruby") throw new Error("Incorrect tag returned");
                     })
                     .end(tellJasmineDone(done));
  });

  it("POST create a Tag", async(done) => {
    const user = await getUser("admin");
    const jwt = await userJwt(user);
    const post = await dbHelpers.getAPost();

    const tag = { title: "My new Tag", posts: post._id };

    supertest(server).post("/api/tags")
                     .set("Authorization", `JWT ${jwt.token}`)
                     .send(tag)
                     .expect(200)
                     .expect( (res: any) => {
                       if ( res.body.title != tag.title ) throw new Error("Wrong title returned");
                       if ( res.body.posts[0] != tag.posts ) throw new Error("Wrong post saved to Tag");
                      })
                     .end(tellJasmineDone(done));
  });

  it("shouild not allow a role of reader to create a Tag", async(done) => {
    const user = await getUser("reader");
    const jwt = await userJwt(user);
    const post = await dbHelpers.getAPost();

    const tag = { title: "My new Tag", posts: post._id };

    supertest(server).post("/api/tags")
                     .set("Authorization", `JWT ${jwt.token}`)
                     .send(tag)
                     .expect(401)
                     .end(tellJasmineDone(done));
  });

  it("POST update a Tag", async(done) => {
    const user = await getUser("admin");
    const jwt = await userJwt(user);
    const post = await Post.findOne().sort({ _id: -1 });
    const tag: any = await Tag.findOne().sort({ _id: -1 });

    const updatedTag = { title: "Wow a new title",  posts: post._id };

    supertest(server).post(`/api/tags/${tag._id}`)
                     .set("Authorization", `JWT ${jwt.token}`)
                     .send(updatedTag)
                     .expect(200)
                     .expect( (res: any) => {
                       if ( res.body.title == tag.title ) throw new Error("Wrong title returned");
                       if ( res.body.posts[0] != tag.posts ) throw new Error("Wrong post saved to tag");
                      })
                     .end(tellJasmineDone(done));
  });

  it("should not allow a role of reader update a Tag", async(done) => {
    const user = await getUser("reader");
    const jwt = await userJwt(user);
    const post = await Post.findOne().sort({ _id: -1 });
    const tag: any = await Tag.findOne().sort({ _id: -1 });

    const updatedTag = { title: "Wow a new title",  posts: post._id };

    supertest(server).post(`/api/tags/${tag._id}`)
                     .set("Authorization", `JWT ${jwt.token}`)
                     .send(updatedTag)
                     .expect(401)
                     .end(tellJasmineDone(done));
  });

});