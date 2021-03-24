const express = require("express");
const multer = require("../app/middlewares/multer");
const routes = express.Router();

const chefs = require("../app/controllers/chefs");
const chefValidators = require("../app/validators/chefs");
const { deleted_point } = require("../app/controllers/chefs");
const { onlyAdmin, onlyUsers } = require("../app/middlewares/session");



routes.get("/", onlyUsers, chefs.index );
routes.get("/create", onlyAdmin,  chefs.create );
routes.get("/deleted_point", onlyAdmin, deleted_point );
routes.post("/", onlyAdmin, multer.array("photoChef", 1), chefValidators.post , chefs.post );
routes.get("/:id", onlyUsers, chefs.show );
routes.get("/:id/edit", onlyAdmin, chefs.edit );
routes.put("/", onlyAdmin, multer.array("photoChef", 1), chefValidators.put, chefs.put );
routes.delete("/", onlyAdmin, chefs.delete );

module.exports = routes;