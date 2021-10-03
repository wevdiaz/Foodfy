const express = require("express");
const multer = require("../app/middlewares/multer");
const routes = express.Router();

const ChefsController = require("../app/controllers/ChefsController");
const chefValidators = require("../app/validators/chefs");
const { onlyAdmin, onlyUsers } = require("../app/middlewares/session");



routes.get("/", onlyUsers, ChefsController.index );
routes.get("/create", onlyAdmin,  ChefsController.create );
routes.post("/", onlyAdmin, multer.array("photoChef", 1), chefValidators.post , ChefsController.post );
routes.get("/:id", onlyUsers, ChefsController.show );
routes.get("/:id/edit", onlyAdmin, ChefsController.edit );
routes.put("/", onlyAdmin, multer.array("photoChef", 1), chefValidators.put, ChefsController.put );
routes.delete("/", onlyAdmin, ChefsController.delete );

module.exports = routes;