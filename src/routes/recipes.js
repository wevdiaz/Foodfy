const express = require("express");
const multer = require("../app/middlewares/multer");
const routes = express.Router();
const { onlyUsers, onlyUserAlterRecipe } = require("../app/middlewares/session");

const RecipesController = require("../app/controllers/RecipesController");
const RecipeValidators = require("../app/validators/recipes");

routes.get("/", onlyUsers, RecipesController.index );
routes.get("/create", onlyUsers, RecipesController.create );

routes.get("/:id", onlyUsers, RecipeValidators.show, RecipesController.show );
routes.get("/:id/edit", onlyUserAlterRecipe, RecipeValidators.edit, RecipesController.edit );
routes.post("/", onlyUsers, multer.array("photos", 5), RecipeValidators.post, RecipesController.post );
routes.put("/:id/edit", onlyUserAlterRecipe, multer.array("photos", 5), RecipeValidators.put, RecipesController.put );
routes.delete("/:id/edit", onlyUserAlterRecipe, RecipesController.delete );

module.exports = routes;