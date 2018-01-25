import { Express } from "express";
import * as blogController from "./controllers/blog.controller";
import { errorHandler } from "./middleware/error.handler";
import * as commentController from "./controllers/comment.controller";
import * as loginController from "./controllers/login.controller";
import * as passport from "passport";

export function routes(app: Express) {

  app.route("/api/blogs")
    .get(blogController.index)
    .post(passport.authenticate("jwt", { session: false }), blogController.create);

  app.route("/api/blog/:id")
     .get(blogController.show)
     .post(passport.authenticate("jwt", { session: false }), blogController.update);

  app.post("/api/comment", commentController.create );

  app.post("/api/login", loginController.login);

  app.post("/api/account", loginController.create);

  app.use(errorHandler);

}
