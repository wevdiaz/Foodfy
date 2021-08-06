const Recipe = require("../models/recipe");
const Chef = require("../models/chef");
const Files = require("../models/File");


module.exports = {

    async landingPage(req, res) {

        try {
            let recipes = await Recipe.all();
            // let recipes = results.rows;

            async function getRecipeImage(recipeID) {
                const file = await Recipe.files(recipeID);                
                return `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }        

            const recipesPromises = recipes.map(async function(recipe) {
                recipe.imageFeatured = await getRecipeImage(recipe.id);            
                return recipe;
            })

            recipes = await Promise.all(recipesPromises);      

            const featuredRecipes = [];

            for( recipe of recipes) {

                if(featuredRecipes.length < 6) {

                    featuredRecipes.push(recipe);
                }
            }        
            
            return res.render("visitors/home", { items: featuredRecipes });

        }catch(err) {
            console.error(err);
        }              
        
    },

    foodfyAbout(req, res) {
        return res.render("visitors/sobre");
    },

    async recipes(req, res) {

        let { page, limit } = req.query;
    
        page = page || 1;
        limit = limit || 6;
    
        let offset = limit * (page - 1);
    
        const params = {        
            page,
            limit,
            offset,
            async callback(recipes) {
    
                try {
                    const pagination = {
                        total: Math.ceil(recipes[0].total/limit),
                        page
                    }
    
                    async function getRecipeImage(recipeID) {
                        const file = await Recipe.files(recipeID);                        
                        // const file = results.rows[0];                
                        return `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
                    }
    
                   
                    const recipesPromises = recipes.map(async function(recipe) {
                        recipe.imageFeatured = await getRecipeImage(recipe.id);
                        return recipe;
                    })
    
                    recipes = await Promise.all(recipesPromises);
                    
                    return res.render("visitors/receitas", { items: recipes, pagination });

                }catch(err) {
                    console.error(err);
                }
    
            }
        }

        const recipesTotal = await Recipe.all();        
        
        if (recipesTotal == "") {
            return res.render("visitors/receitas", { items: recipesTotal.length });
        }
        else {
            Recipe.paginate(params);     
        }        
    },

    async chefs(req, res){

        try {
            let chefs = await Chef.all();
            // let chefs = results.rows;

            const chefsAvatarPromise = chefs.map(async function(chef){
                let avatarChef = await Chef.getImageChef(chef.id);                 
                chef.avatar = `${req.protocol}://${req.headers.host}${avatarChef.image.replace("public", "")}`;

                // chef = {
                //     ... chef,
                //     avatar: avatarChef
                // }

                return chef;

            });

            chefs = await Promise.all(chefsAvatarPromise);
            
            return res.render("visitors/chefs", { chefs }); 

        }catch(err) {
            console.log(err);
        }       
    
    },

    async chefProfile(req, res) {
        try {

            let chef = await Chef.find(req.params.id);
            // let chef = results.rows[0];

            if (!chef) return res.send("Chef not found");

            let avatarChef = await Chef.getImageChef(chef.id);             
            chef.avatar = `${req.protocol}://${req.headers.host}${avatarChef.image.replace("public", "")}`;

            // chef = {
            //     ...chef,
            //     avatar: avatarChef
            // }

            let recipes = await Chef.findRecipes(chef.id);
            // let recipes = results.rows;

            if (recipes[0].id != null) {
                const recipesPromises = recipes.map(async function(recipe) {
                    const file = await Recipe.files(recipe.id);
                    // const file = results.rows[0];

                    recipe.imageFeatured = `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`;
                    return recipe;
                });

                recipes = await Promise.all(recipesPromises);
            }

            return res.render("visitors/chef_profile", { chef, recipes });

        }catch(err) {
            console.error(err);
        }
    },

    async detailRecipe(req, res){ 

        try {
            const recipe = await Recipe.findRecipe(req.params.index);
            
            // let results = await Recipe.find(req.params.index);
            // const recipe = results.rows[0];
                                    
            if(!recipe) {
                return res.render("Recipe not found");
            }

            let files = await Recipe.allFiles(recipe.id);
            files = files.map( file => ({
                ...file,
                src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`            
            }));

            // results = await Recipe.files(recipe.id);
            // let files = results.rows;
            // files = files.map( file => ({
            //     ...file,
            //     src:`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`            
            // }));

            const imageFeatured = files[0].src;            

            return res.render(`visitors/detalhe`, { recipe, imageFeatured, files });

        }catch(err) {
            console.error(err);
        }    
               
    },

    async SearchRecipes(req, res){
    
        try {
            const { filter } = req.query;
    
            if (filter) {

                let recipes = await Recipe.findBy(filter);
                
                // const results = await Recipe.findBy(filter);
                // let recipes = results.rows;

                async function getRecipeImage(recipeID) {
                    const file = await Recipe.files(recipeID);
                    
                    // const results = await Recipe.files(recipeID);
                    // const file = results.rows[0];

                    return `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
                }

                const recipesPromises = recipes.map(async function(recipe) {
                    recipe.imageFeatured = await getRecipeImage(recipe.id);
                    return recipe
                });

                recipes = await Promise.all(recipesPromises);

                return res.render("visitors/search", { items: recipes, filter }); 
            }  
            else {

                await Recipe.all();    
                return res.render("visitors/search", { filter });                
            }
            
        }catch(err) {
            console.error(err);
        }        
    
    }

}