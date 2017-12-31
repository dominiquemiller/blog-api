import { Express } from "express";
import * as blogController from "./controllers/blog.controller";
import { errorHandler } from "./middleware/error.handler";
import * as commentController from "./controllers/comment.controller";

export function routes(app: Express) {

  app.route("/api/blogs")
    .get(blogController.index)
    .post(blogController.create);

  app.route("/api/blog/:id")
     .get(blogController.show)
     .patch(blogController.update);

  app.post("/api/comment", commentController.create );

  app.use(errorHandler);

}
