process.env.NODE_ENV = "test";

import * as supertest from "supertest";
import * as server from "../../src/server";
import * as dbHelpers from "../helpers/db.helper";
const tellJasmineDone = require("jasmine-supertest");
import {} from "jasmine";
import { userJwt, getUser } from "../helpers/auth_helpers";
import { MediaModel } from "../../src/models/media.model";
import * as S3 from "../../src/services/s3.service";

describe("Media route", () => {

  describe("when authorized and authenticated", () => {
    let media: MediaModel = undefined;

    beforeEach( async (done) => {
      const user = await dbHelpers.seedModel("Users");
      media = await dbHelpers.seedModel("Media");
      done();
    });

    afterEach( () => {
      dbHelpers.dropDB({ users: "Users", media: "Media" });
    });

    it("should destroy media document", async (done) => {
      const user = await getUser("admin");
      const jwt = await userJwt(user);

      spyOn(S3, "deleteMedia").and.returnValue(() => {
        return Promise.resolve("deleted");
      });

      supertest(server).delete(`/api/media/${media._id}`)
                       .set("Authorization", `JWT ${jwt.token}`)
                       .expect(200)
                       .expect( (res: any) => {
                         if (res.body === null) throw new Error("Media Document not found");
                       })
                       .end(tellJasmineDone(done));

    });

  });

  describe("with no authentication", () => {
    let media: MediaModel = undefined;

    beforeEach( async (done) => {
      const user = await dbHelpers.seedModel("Users");
      media = await dbHelpers.seedModel("Media");
      done();
    });

    afterEach( () => {
      dbHelpers.dropDB({ users: "Users", media: "Media" });
    });

    it("should not allow a reader destroy media document", async (done) => {
      const user = await getUser("reader");
      const jwt = await userJwt(user);

      supertest(server).delete(`/api/media/${media._id}`)
                       .set("Authorization", `JWT ${jwt.token}`)
                       .expect(401)
                       .end(tellJasmineDone(done));
    });

  });

});