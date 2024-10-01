const { Router } = require("express");
const UserController = require("./controller/UserController");

const routes = Router();

routes.get("/user", new UserController().getAll)

module.exports = routes;