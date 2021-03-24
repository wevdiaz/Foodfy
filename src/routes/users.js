const express = require("express");
const routes = express.Router();
const { onlyAdmin, onlyUsers, isLoggedRedirectToProfile } = require("../app/middlewares/session");

const UserController = require("../app/controllers/UserController");
const ProfileController = require("../app/controllers/ProfileController");
const SessionController = require("../app/controllers/SessionController");
const ValidatorUser = require("../app/validators/users");
const ValidatorSession = require("../app/validators/session");

// Login/ Logout
routes.get("/login", isLoggedRedirectToProfile,  SessionController.loginForm);
routes.post("/login", ValidatorSession.login, SessionController.login);
routes.post("/logout", SessionController.logout);


// // reset password / forgot
routes.get("/forgot-password", SessionController.forgotForm);
routes.get("/password-reset", SessionController.resetForm);
routes.post("/forgot-password", ValidatorSession.forgot, SessionController.forgot);
routes.post("/password-reset", ValidatorSession.reset, SessionController.reset);


// User profile
routes.get("/", onlyUsers, ValidatorUser.index, ProfileController.index); 
routes.put("/", onlyUsers, ValidatorUser.put, ProfileController.put); 
routes.get("/my-recipes", onlyUsers, ProfileController.recipesUser ); 



// User admin
routes.get("/list", onlyAdmin, UserController.list); 
routes.get("/register", onlyAdmin, UserController.registerForm); 
routes.post("/register",onlyAdmin, ValidatorUser.post , UserController.post); 
routes.get("/:id/edit", onlyAdmin, UserController.edit); 
routes.put("/list", onlyAdmin, ValidatorUser.updateUser, UserController.put) 
routes.delete("/list",onlyAdmin, UserController.delete) 

module.exports = routes;