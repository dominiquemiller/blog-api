process.env.NODE_ENV = "test";

import { MediaSizes } from "../../src/services/media-sizes.service";
import { seedModel, dropDB } from "../helpers/db.helper";
import { MediaModel } from "../../src/models/media.model";
import * as S3 from "../../src/services/s3.service";
import {} from "jasmine";

describe("Media Sizes Service", () => {
  let media: MediaModel = undefined;
  let testFile: any = undefined;

  beforeAll( async (done) => {
    media = await seedModel("Media");
    testFile = { url: "http://www.clker.com/cliparts/b/e/U/I/k/O/add2-png-md.png",
                 name: media.name,
                 key: media.key,
                 id: media._id
               };
    done();
  });

  afterAll( () => {
    dropDB({media: "Media"});
  });

  it("should be truthy", () => {
    const service = MediaSizes.getInstance();
    expect(service).toBeTruthy();
  });

  it("should create multiple sizes of image", async () => {
    spyOn(MediaSizes.getInstance(), "thumbnail");
    spyOn(MediaSizes.getInstance(), "small");
    spyOn(MediaSizes.getInstance(), "medium");

    const service = await MediaSizes.getInstance().process(testFile);

    expect(MediaSizes.getInstance().thumbnail).toHaveBeenCalled();
    expect(MediaSizes.getInstance().medium).toHaveBeenCalled();
    expect(MediaSizes.getInstance().small).toHaveBeenCalled();
  });

  it("should upload resized images to s3", async() => {
    spyOn(S3, "uploadMedia");

    const service = await MediaSizes.getInstance().process(testFile);

    expect(S3.uploadMedia).toHaveBeenCalledTimes(3);
  });

  it("should update media document with updated keys", async() => {
    spyOn(S3, "uploadMedia").and.callFake( () => {
      return Promise.resolve("test_key_value");
    });

    const service = await MediaSizes.getInstance().process(testFile);

    expect(service.thumbnailKey).toBe("test_key_value");
    expect(service.smallKey).toBe("test_key_value");
    expect(service.mediumKey).toBe("test_key_value");
  });
});