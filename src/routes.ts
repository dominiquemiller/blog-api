import { Express } from "express";

// controllers
import * as postController from "./controllers/post.controller";
import * as commentController from "./controllers/comment.controller";
import * as loginController from "./controllers/login.controller";
import * as accountController from "./controllers/account.controller";
import * as categoryController from "./controllers/category.controller";
import * as tagController from "./controllers/tag.controller";
import * as passport from "passport";

// middleware
import { errorHandler } from "./middleware/error.handler";
import { roleAuthorization } from "./middleware/authorization";

export function routes(app: Express) {

  const jwtAuth = passport.authenticate("jwt", { session: false });

  app.route("/api/blogs")
    .get(postController.index)
    .post(jwtAuth, roleAuthorization(["editor", "admin"]), postController.create);

  app.route("/api/blogs/:id")
     .get(postController.show)
     .post(jwtAuth, roleAuthorization(["editor", "admin"]), postController.update);

  app.route("/api/categories")
    .get(categoryController.index)
    .post(jwtAuth, roleAuthorization(["editor", "admin"]), categoryController.create);

  app.route("/api/categories/:id")
    .get(categoryController.show)
    .post(jwtAuth, roleAuthorization(["editor", "admin"]), categoryController.update);

  app.route("/api/tags")
    .get(tagController.index)
    .post(jwtAuth, roleAuthorization(["editor", "admin"]), tagController.create);

  app.route("/api/tags/:id")
    .get(tagController.show)
    .post(jwtAuth, roleAuthorization(["editor", "admin"]), tagController.update);

  app.post("/api/comment", commentController.create );

  app.post("/api/login", loginController.login);

  app.post("/api/account", accountController.create);

  app.use(errorHandler);

}
