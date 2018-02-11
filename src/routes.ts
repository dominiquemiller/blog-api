import { Express } from "express";
import * as blogController from "./controllers/blog.controller";
import { errorHandler } from "./middleware/error.handler";
import * as commentController from "./controllers/comment.controller";
import * as loginController from "./controllers/login.controller";
import * as accountController from "./controllers/account.controller";
import * as categoryController from "./controllers/category.controller";
import * as tagController from "./controllers/tag.controller";
import * as passport from "passport";

export function routes(app: Express) {

  app.route("/api/blogs")
    .get(blogController.index)
    .post(passport.authenticate("jwt", { session: false }), blogController.create);

  app.route("/api/blogs/:id")
     .get(blogController.show)
     .post(passport.authenticate("jwt", { session: false }), blogController.update);

  app.route("/api/categories")
    .get(categoryController.index)
    .post(passport.authenticate("jwt", { session: false }), categoryController.create);

  app.route("/api/categories/:id")
    .get(categoryController.show)
    .post(passport.authenticate("jwt", { session: false }), categoryController.update);

  app.route("/api/tags")
    .get(categoryController.index)
    .post(passport.authenticate("jwt", { session: false }), categoryController.create);

  app.route("/api/tags/:id")
    .get(tagController.show)
    .post(passport.authenticate("jwt", { session: false }), tagController.update);

  app.post("/api/comment", commentController.create );

  app.post("/api/login", loginController.login);

  app.post("/api/account", accountController.create);

  app.use(errorHandler);

}
