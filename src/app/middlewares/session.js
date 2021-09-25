const User = require("../models/User");
const Recipe = require("../models/recipe");

async function onlyAdmin(req, res, next) {   

    if (!req.session.userID) {
        return res.redirect("/admin/users/login");
    }

    const id = req.session.userID;    
    const user = await User.findOne({ where: { id }});

    if (!user.is_admin) {
        return res.redirect("/admin/profile");
    }    

    next();
}

function onlyUsers(req, res, next) {
    if (!req.session.userID) {
        return res.redirect("/admin/users/login");
    }  

    next();
}


async function onlyUserAlterRecipe(req, res, next) {
    const recipeId = req.params.id;
    const id = req.session.userID;

    const user = await Recipe.find(recipeId);
    
    const admin = await User.findOne({ where: {id}});    

    if (user.user_id != admin.id && admin.is_admin === false) {
        return res.redirect("/admin/profile");
    }

    next();
}


function isLoggedRedirectToProfile(req, res, next) {
    if (req.session.userID) {
        return res.redirect("/admin/profile");
    }

    next();
}

module.exports = {
    onlyAdmin,
    onlyUsers,
    isLoggedRedirectToProfile,
    onlyUserAlterRecipe
}