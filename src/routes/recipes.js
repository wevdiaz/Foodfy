const express = require("express");
const multer = require("../app/middlewares/multer");
const routes = express.Router();
const { onlyUsers, onlyUserAlterRecipe } = require("../app/middlewares/session");

const recipes = require("../app/controllers/recipes");
const RecipeValidators = require("../app/validators/recipes");

routes.get("/", onlyUsers, recipes.index );
routes.get("/create", onlyUsers, recipes.create );

routes.get("/:id", onlyUsers, RecipeValidators.show, recipes.show );
routes.get("/:id/edit", onlyUserAlterRecipe, RecipeValidators.edit, recipes.edit );
routes.post("/", onlyUsers, multer.array("photos", 5), RecipeValidators.post, recipes.post );
routes.put("/:id/edit", onlyUserAlterRecipe, multer.array("photos", 5), RecipeValidators.put, recipes.put );
routes.delete("/:id/edit", onlyUserAlterRecipe, recipes.delete );

module.exports = routes;