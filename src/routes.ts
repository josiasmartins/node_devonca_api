import { Router } from "express";
import { UserController } from "./controller/UserController";

const routes = Router();

routes.get("/user/", new UserController().getAll)
routes.post("/user/", new UserController().createUser);
routes.put("/user/:id", new UserController().updateUser);
routes.delete("/user/:id", new UserController().deleteUser);

export default routes;