process.env.NODE_ENV = "test";

import { S3 } from "aws-sdk";
import * as S3service from "../../src/services/s3.service";
import {} from "jasmine";

describe("S3 serivce", () => {

  it("should retrieve a public url to media asset", () => {
    spyOn(S3.prototype, "getSignedUrl");

    S3service.getPreSignedUrl("testKey", 3000).then( (url) => {
      expect(S3.prototype.getSignedUrl).toHaveBeenCalled();
    });
  });

  it("should upload a media asset", () => {
    spyOn(S3.prototype, "upload");

    S3service.uploadMedia("fake.jpg", "testKey").then( (data) => {
      expect(S3.prototype.deleteObject).toHaveBeenCalled();
    });
  });

});