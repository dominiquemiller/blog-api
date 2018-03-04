process.env.NODE_ENV = "test";

import * as supertest from "supertest";
import * as server from "../../src/server";
import * as dbHelpers from "../helpers/db.helper";
const tellJasmineDone = require("jasmine-supertest");
import {} from "jasmine";
import { userJwt, getUser } from "../helpers/auth_helpers";
import { default as Post, PostModel } from "../../src/models/post.model";
import { Category, CategoryModel } from "../../src/models/category.model";

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

    function countCheck(docArray: Array<any>) {
       return docArray.every( (value: any, index: number) => {
        return value.count === 0;
      });
    }

    supertest(server).get("/api/categories")
                     .expect(200)
                     .expect( (res: any) => {
                       if (res.body.length !== 4) throw new Error("Incoreect number of posts returned");
                       if (!countCheck(res.body)) throw new Error("Incorrect count of posts for each category");
                     })
                     .end(tellJasmineDone(done));
  });

  it("GET should return a category", async(done) => {
    const cat = await Category.findOne({ title: "General" });

    supertest(server).get(`/api/categories/${cat._id}`)
                     .expect(200)
                     .expect( (res: any) => {
                       if (res.body.title !== "General") throw new Error("Incorrect category returned");
                     })
                     .end(tellJasmineDone(done));
  });

  it("POST create a category", async(done) => {
    const user = await getUser("admin");
    const jwt = await userJwt(user);
    const post = await dbHelpers.getAPost();

    const category = { title: "My new category", posts: [ post._id ] };

    supertest(server).post("/api/categories")
                     .set("Authorization", `JWT ${jwt.token}`)
                     .send(category)
                     .expect(200)
                     .expect( (res: any) => {

                       if ( res.body.title !== category.title ) throw new Error("Wrong title returned");
                       if ( res.body.posts[0] != category.posts[0] ) throw new Error("Wrong post saved to category");
                      })
                     .end(tellJasmineDone(done));
  });

  it("should not allow a role of reader to create a category", async(done) => {
    const user = await getUser("reader");
    const jwt = await userJwt(user);
    const post = await dbHelpers.getAPost();

    const category = { title: "My new category", posts: [ post._id ] };

    supertest(server).post("/api/categories")
                     .set("Authorization", `JWT ${jwt.token}`)
                     .send(category)
                     .expect(401)
                     .end(tellJasmineDone(done));
  });

  it("POST update a category", async(done) => {
    const user = await getUser("admin");
    const jwt = await userJwt(user);
    const post = await Post.findOne().sort({ _id: -1 });
    const cat: any = await Category.findOne().sort({ _id: -1 });

    const updatedCategory = { title: "Wow a new title",  posts: post._id };

    supertest(server).post(`/api/categories/${cat._id}`)
                     .set("Authorization", `JWT ${jwt.token}`)
                     .send(updatedCategory)
                     .expect(200)
                     .expect( (res: any) => {
                       if ( res.body.title == cat.title ) throw new Error("Wrong title returned");
                       if ( res.body.posts[0] != cat.posts[0] ) throw new Error("Wrong post saved to category");
                      })
                     .end(tellJasmineDone(done));
  });

  it("should not allow a role of reader to update a category", async(done) => {
    const user = await getUser("reader");
    const jwt = await userJwt(user);
    const post = await Post.findOne().sort({ _id: -1 });
    const cat: any = await Category.findOne().sort({ _id: -1 });

    const updatedCategory = { title: "Wow a new title",  posts: post._id };

    supertest(server).post(`/api/categories/${cat._id}`)
                     .set("Authorization", `JWT ${jwt.token}`)
                     .send(updatedCategory)
                     .expect(401)
                     .end(tellJasmineDone(done));
  });

});