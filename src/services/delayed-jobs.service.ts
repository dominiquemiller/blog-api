import * as kue from "kue";
import { config } from "../config";
import { MediaSizes } from "../services/media-sizes.service";
const env = process.env.NODE_ENV;
const envConfig = config[env];

const redis = { redis: envConfig.redis.connect };
const queue = kue.createQueue(redis);

function resizeImage(data: any) {
  const job = queue.create("resizeImage", data)
    .priority("critical")
    .attempts(8)
    .backoff(true)
    .save();

  job.on("complete", () => {
    console.log("completed");
  }).on("failed", () => {
    console.error("job failed");
  }) ;
}

queue.process("resizeImage", 1, async (job, done) => {
    const mediaService = MediaSizes.getInstance();
    const resized = await mediaService.process(job.data);
    if (resized) done();
});

// add more types of jobs to this object
export const job = {
  media: (data: any) => {
    resizeImage(data);
  }
};