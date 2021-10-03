const express = require("express");
const routes = express.Router();

const VisitorController = require("../app/controllers/VisitorController");

const users = require("./users");
const recipes = require("./recipes");
const chefs = require("./chefs");

routes.use("/admin/users", users);
routes.use("/admin/profile", users);

routes.get("/", VisitorController.landingPage );
routes.get("/sobre", VisitorController.foodfyAbout );
routes.get("/receitas", VisitorController.recipes );
routes.get("/chefs", VisitorController.chefs );
routes.get("/chef/:id", VisitorController.chefProfile );
routes.get("/detalhe/:index", VisitorController.detailRecipe );
routes.get("/search", VisitorController.SearchRecipes );


routes.use("/admin/recipes", recipes);
routes.use("/admin/chefs", chefs);


module.exports = routes;
