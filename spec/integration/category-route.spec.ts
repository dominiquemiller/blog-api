process.env.NODE_ENV = "test";

import * as supertest from "supertest";
import * as server from "../../src/server";
import * as dbHelpers from "../helpers/db.helper";
const tellJasmineDone = require("jasmine-supertest");
import {} from "jasmine";

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

});