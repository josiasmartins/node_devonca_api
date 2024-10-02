import { Router } from "express";
import { UserController } from "./controller/UserController";
// import { badRequestHandler } from "./error_handler/BadRequestHandler";

const routes = Router();

routes.get("/user/", new UserController().getAll);
routes.post("/user/", new UserController().createUser);
routes.put("/user/:id", new UserController().updateUser);
routes.delete("/user/:id", new UserController().deleteUser);

export default routes;