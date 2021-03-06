
const db = require("../../config/db");
const Recipe = require("../models/recipe");
const File = require("../../app/models/File");
const RecipeFiles = require("../models/RecipeFiles");
const User = require("../models/User");

async function findUserSession(id) {
    const userSession = await User.findOne({ where: { id }});
    return userSession;
}

module.exports = {
    
    async index(req, res){

        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 6;

        let offset = limit * (page - 1);

        const params = {
            filter,
            page,
            limit,
            offset,
            async callback(recipes) {

                try {
                    const pagination = {                        
                        total: Math.ceil(recipes[0].total / limit),
                        page
                    }
    
                    const results = await Recipe.chefsSelectOptions();
                    const options = results.rows;
    
                    async function getRecipeImage(recipeID) {
                        const results = await Recipe.files(recipeID);
                        const file = results.rows[0];
                        
    
                        return `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
                    }
    
                    const recipesPromises = recipes.map(async function(recipe) {
                        recipe.imageFeatured = await getRecipeImage(recipe.id);
                        return  recipe;
                        
                    })
    
                    recipes = await Promise.all(recipesPromises);
                                    
                    return res.render("admin/recipes/index", { recipes, chefOptions: options, pagination });

                }catch(err) {
                    console.error(err);
                }                

            }
        }

        const results = await Recipe.all();
        const recipesTotal = results.rows;
                
        if (recipesTotal == "") {
            return res.render("admin/recipes/index", { recipes: recipesTotal.length });
        }
        else {

            Recipe.paginate(params);   
        }        
    },

    async create(req,res){

        try {
            const results = await Recipe.chefsSelectOptions();
            const options = results.rows;
           
            return res.render("admin/recipes/create", {chefOptions: options });

        }catch(err) {
            console.error(err);
        }
        
    },

    async show(req, res){

        try {
            const { recipe } = req;            

            results = await Recipe.files(recipe.id);
            let files = results.rows;
            files = files.map( file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }));

            const imageFeatured = files[0].src;           

            const id = req.session.userID;

            const userSession = await User.findOne({ where: { id }});
            
            return res.render("admin/recipes/show", { recipe, imageFeatured, files, userSession } );

        }catch(err) {
            console.error(err)
        }          

    },

    async post(req, res){
        
        try {      
           
            const datasRecipe = {
                ...req.body,
                user_id: req.session.userID
            }            

            let results = await Recipe.create(datasRecipe);
            const recipeID = results.rows[0].id;   

            const filesPromise = req.files.map(async function(file){
                
                const results = await File.create({...file})
                let fileID= results.rows[0].id;
                
                const data = {
                    recipeID: recipeID,
                    fileID
                }                                            

                await RecipeFiles.create(data);
                
            });
            
            await Promise.all(filesPromise);

            let result = await Recipe.find(recipeID);
            const recipe = result.rows[0];

            result = await Recipe.files(recipe.id);
            let files = result.rows;

            files = files.map( file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }));

            const imageFeatured = files[0].src;
            
            const userSession = await findUserSession(req.session.userID);            

            return res.render("admin/recipes/show", {
                recipe,
                imageFeatured,
                files,
                userSession,
                success: "Receita cadastrada com sucesso!"
            });

        } catch(err) {
            console.error(err);
        }
    },

    async edit(req, res){

        try {
            const { recipe } = req;

            let results = await Recipe.chefsSelectOptions();
            const options = results.rows;

        
            results = await Recipe.files(recipe.id);
            let files = results.rows;
            files = files.map( file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }));     
            
            return res.render("admin/recipes/edit", { recipe, chefOptions: options, files } ); 

        }catch(err) {
            console.error(err)
        }       
        

    },

    async put(req, res){

        try {     

            if (req.files.length != 0 ) {

                const newFilesPromise = req.files.map(async function(file) {
                    const results = await File.create(file);
                    const fileID = results.rows[0].id;

                    const data = {
                        recipeID: req.body.id,
                        fileID
                    }

                    await RecipeFiles.create(data);
                })

                await Promise.all(newFilesPromise);
            }                 

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",");
                const lastIndex = removedFiles.length - 1;
                removedFiles.splice(lastIndex, 1); 

                const removedFilesPromise = removedFiles.map(async function(id) {

                    const result  = await File.getIdFiles(id);
                    const fileIdDelete = result.rows[0].file_id;
                                    
                    RecipeFiles.delete(id)
                    File.delete(fileIdDelete)
                });

                await Promise.all(removedFilesPromise);
            }
            
            await Recipe.update(req.body);

            let results = await Recipe.find(req.body.id);
            const recipe = results.rows[0];

            results = await Recipe.files(req.body.id);
            let files = results.rows;

            files = files.map( file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }));

            const imageFeatured = files[0].src;            
            const userSession = await findUserSession(req.session.userID);
            
            return res.render("admin/recipes/show", {
                recipe,
                files,
                imageFeatured,
                userSession,
                success: "Receita Atualizada com sucesso!"
            });            

        }catch(err) {
            console.error(err);
        } 

    },

    async delete(req, res){

       try {
            let data = {
                id: req.body.id,
                files_recipes: req.body.files_recipes.split(",")
            }
    
            data.files_recipes.splice( (data.files_recipes.length - 1), 1);          
    
            const filesRemovedPromise = data.files_recipes.map(async function(file){
                const results = await RecipeFiles.getIdFiles(file);
                const RemoveFile = results.rows[0].file_id;            
    
                RecipeFiles.delete(file);
                File.delete(RemoveFile);  
            });
    
            await Promise.all(filesRemovedPromise); 
    
            await Recipe.delete(data.id);
                
            return res.redirect("/admin/recipes/delete_recipe"); 

       }catch(err) {
           console.log(err);
       }        

    },
    
    deleteRecipe(req, res) {
        return res.render("admin/recipes/delete_recipe");
    }
}
