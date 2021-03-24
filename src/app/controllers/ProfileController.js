const User = require("../models/User");
const Recipe = require("../models/recipe");

module.exports = {

    async index(req, res) {
       
       const { user } = req; 
       
       return res.render("admin/user/index", { user });
    },

    async put(req, res) {

        try {
            const { user } = req;
            let { name, email } = req.body;
            
            await User.update(user.id, {
                name,
                email
            });

            return res.render("admin/user/index", {
                user: req.body,
                success: "Conta atualizada com sucesso!"
            });

        }catch(err) {
            console.error(err);
            return res.render("admin/user/index", {
                error: "Algum erro aconteceu!"
            });
        }
        
    },

    async recipesUser(req, res) {
        let { page, limit } = req.query;

        page = page || 1;
        limit = limit || 6;

        let offset = limit *(page - 1);

        let id = req.session.userID;        

        const params = {            
            page,
            limit,
            offset,
            id,
            async callback(recipes) {
                try {
                    const pagination = {
                        total: Math.ceil(recipes[0].total / limit),
                        page
                    }

                    async function getRecipeImage(recipeID) {
                        const results = await Recipe.files(recipeID);
                        const file = results.rows[0];

                        return `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
                    }

                    async function getNameChef(recipeUser_id) {
                        const results =  await Recipe.findByUserRecipe(recipeUser_id);                        
                        return results.rows[0].chef_name;
                    }

                    const recipesPromises = recipes.map(async function(recipe) {
                        recipe.imageFeatured = await getRecipeImage(recipe.id);
                        recipe.chef_name = await getNameChef(recipe.user_id);
                        return recipe;
                    });

                    recipes = await Promise.all(recipesPromises);
                    
                    return res.render("admin/user/my-recipes", { recipes, pagination });

                }catch(err) {
                    console.error(err);                    
                }
            }
        }

        const results = await Recipe.findByUserRecipe(id);
        const recipesTotal = results.rows;

        if (recipesTotal == "") {
            return res.render("admin/user/my-recipes", { recipes: recipesTotal.length });
        }
        else {
            Recipe.paginateUser(params);
        }       
    }
}