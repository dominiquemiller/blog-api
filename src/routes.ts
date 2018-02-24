import { Express } from "express";
import * as postController from "./controllers/post.controller";
import { errorHandler } from "./middleware/error.handler";
import * as commentController from "./controllers/comment.controller";
import * as loginController from "./controllers/login.controller";
import * as accountController from "./controllers/account.controller";
import * as categoryController from "./controllers/category.controller";
import * as tagController from "./controllers/tag.controller";
import * as passport from "passport";

export function routes(app: Express) {

  app.route("/api/blogs")
    .get(postController.index)
    .post(passport.authenticate("jwt", { session: false }), postController.create);

  app.route("/api/blogs/:id")
     .get(postController.show)
     .post(passport.authenticate("jwt", { session: false }), postController.update);

  app.route("/api/categories")
    .get(categoryController.index)
    .post(passport.authenticate("jwt", { session: false }), categoryController.create);

  app.route("/api/categories/:id")
    .get(categoryController.show)
    .post(passport.authenticate("jwt", { session: false }), categoryController.update);

  app.route("/api/tags")
    .get(tagController.index)
    .post(passport.authenticate("jwt", { session: false }), tagController.create);

  app.route("/api/tags/:id")
    .get(tagController.show)
    .post(passport.authenticate("jwt", { session: false }), tagController.update);

  app.post("/api/comment", commentController.create );

  app.post("/api/login", loginController.login);

  app.post("/api/account", accountController.create);

  app.use(errorHandler);

}
