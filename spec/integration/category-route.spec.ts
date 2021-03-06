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
    const user = await dbHelpers.seedModel("Users");
    const categories = await dbHelpers.seedModel("Categories");
    // get category ids and populate post categories property
    const catIds = await dbHelpers.idArray("Categories");
    const posts = await dbHelpers.seedPosts(user._id, catIds);
    done();
  });

  afterAll( () => {
    dbHelpers.dropDB({ users: "Users", posts: "Posts", cats: "Categories" });
  });

  it("GET should return a list of categories", (done) => {

    supertest(server).get("/api/categories")
                     .expect(200)
                     .expect( (res: any) => {
                       if (res.body.length !== 4) throw new Error("Incorect number of categories returned");
                       if (res.body[0].posts.length !== 3) throw new Error("Virtual field not populating with posts");
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

    const category = { title: "My new category" };

    supertest(server).post("/api/categories")
                     .set("Authorization", `JWT ${jwt.token}`)
                     .send(category)
                     .expect(200)
                     .expect( (res: any) => {
                       if ( res.body.title !== category.title ) throw new Error("Wrong title returned");
                      })
                     .end(tellJasmineDone(done));
  });

  it("should not allow a role of reader to create a category", async(done) => {
    const user = await getUser("reader");
    const jwt = await userJwt(user);

    const category = { title: "My new category" };

    supertest(server).post("/api/categories")
                     .set("Authorization", `JWT ${jwt.token}`)
                     .send(category)
                     .expect(401)
                     .end(tellJasmineDone(done));
  });

  it("POST update a category", async(done) => {
    const user = await getUser("admin");
    const jwt = await userJwt(user);
    const cat: any = await Category.findOne().sort({ _id: -1 });

    const updatedCategory = { title: "Wow a new title" };

    supertest(server).post(`/api/categories/${cat._id}`)
                     .set("Authorization", `JWT ${jwt.token}`)
                     .send(updatedCategory)
                     .expect(200)
                     .expect( (res: any) => {
                       if ( res.body.title == cat.title ) throw new Error("Wrong title returned");
                      })
                     .end(tellJasmineDone(done));
  });

  it("should not allow a role of reader to update a category", async(done) => {
    const user = await getUser("reader");
    const jwt = await userJwt(user);
    const cat: any = await Category.findOne().sort({ _id: -1 });

    const updatedCategory = { title: "Wow a new title" };

    supertest(server).post(`/api/categories/${cat._id}`)
                     .set("Authorization", `JWT ${jwt.token}`)
                     .send(updatedCategory)
                     .expect(401)
                     .end(tellJasmineDone(done));
  });

});