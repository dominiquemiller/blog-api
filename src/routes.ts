import { Express } from "express";
import * as blogController from "./controllers/blog.controller";

export function routes(app: Express) {

  app.route("/api/blogs")
    .get(blogController.index)
    .post(blogController.create)
    .patch(blogController.update);

  app.get("/api/blog/:id", blogController.show);

}
