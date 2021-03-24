const { foundDate } = require("../../lib/utils");

const db = require("../../config/db");
const Chef = require("../models/chef");
const Recipe = require("../models/recipe");
const File = require("../models/File");
const User = require("../models/User");


async function findChef(req, id) {
    let results = await Chef.find(id);
    let chef = results.rows[0];

    results = await Chef.getImageChef(chef.id);
    let avatarChef = results.rows[0];
    avatarChef = `${req.protocol}://${req.headers.host}${avatarChef.image.replace("public", "")}`;

    chef = {
        ...chef,
        avatar: avatarChef
    }

    return chef;
}

async function findUserSession(id) {
    const userSession = await User.findOne({ where: { id }});
    return userSession;
}

async function findImageChef(req, id) {
    const results = await Chef.getImageChef(id);
    let avatarChef = results.rows[0];
    avatarChef = `${req.protocol}://${req.headers.host}${avatarChef.image.replace("public", "")}`;
    return avatarChef;
}

module.exports = {

    async index(req, res) { 
        
        try {

            const results = await Chef.all();
            let chefs = results.rows;

            const chefsAvatarPromise = chefs.map(async function(chef) {
            
                const results = await Chef.getImageChef(chef.id);
                let avatarChef = results.rows[0];
                avatarChef = `${req.protocol}://${req.headers.host}${avatarChef.image.replace("public", "")}`;
                
                chef = {
                    ...chef,
                    avatar: avatarChef
                }

                return chef;

            });

            chefs = await Promise.all(chefsAvatarPromise);
            
            const id = req.session.userID;
            const userSession = await User.findOne({ where: { id }});            

            return res.render("admin/chefs/index", { chefs, userSession }); 

        }catch(err){
            console.error(err);
        }  

    },

    create(req, res) { 

        return res.render("admin/chefs/create");
    },

    async show(req, res) {

        try {
            let results = await Chef.find(req.params.id);
            let chef = results.rows[0]; 
            
            if (!chef) return res.send("Chef not found");

            results = await Chef.getImageChef(chef.id);
            let avatarChef = results.rows[0];
            avatarChef = `${req.protocol}://${req.headers.host}${avatarChef.image.replace("public", "")}`;

            chef = {
                ...chef,
                avatar: avatarChef
            }       

            results = await Chef.findRecipes(chef.id);
            let recipes = results.rows; 
                    
            if (recipes[0].id != null) {
                const recipesPromises = recipes.map(async function(recipe) {
                    const results = await Recipe.files(recipe.id);
                    const file = results.rows[0];
                
                    recipe.imageFeatured = `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`;            
                    return recipe;
                })
        
                recipes = await Promise.all(recipesPromises);

                const id = req.session.userID;
                const userSession = await User.findOne({ where: { id }});
                
                return res.render("admin/chefs/show", { chef, chefRecipes: recipes, userSession });
            }
            else  {

                const id = req.session.userID;
                const userSession = await User.findOne({ where: { id }});

                return res.render("admin/chefs/show", { chef, chefRecipes: recipes, userSession });
            }

        }catch(err) {
            console.error(err);
        }       
    },

    async post(req, res) {

       try {
                
            let results = await File.create({...req.files[0]});
            const file = results.rows[0].id; 
            
            const data = {
            name: req.body.name,
            file_id: file
            }      
    
            results = await Chef.create(data);
            const id = results.rows[0].id;
            
            
            const chef = await findChef(req, id);
            const userSession = await findUserSession(req.session.userID);            
            
            return res.render("admin/chefs/show", {
                chef,
                userSession,
                success: "Chef criado com sucesso!"
            });

       }catch(err) {
           console.error(err);
       }         
        
    },

    async edit(req, res) {

        try {
            let results = await Chef.find(req.params.id);
            let chef = results.rows[0];

            if(!chef) return res.send("Chef not found!");        

            results = await Chef.getImageChef(chef.id);
            let avatarChef = results.rows[0];
            avatarChef = `${req.protocol}://${req.headers.host}${avatarChef.image.replace("public", "")}`;
            
            chef = {
                ...chef,
                avatar: avatarChef           
            }              

            return res.render("admin/chefs/edit", { chef });

        }catch(err) {
            console.error(err);
        }

    },

    async put(req, res) {

        try {            

            let file = req.body.file_id;              

            if (req.files.length != 0) {
                let results = await File.create({...req.files[0]});
                file = results.rows[0].id;            
            }

            const data = {
                name: req.body.name,
                file_id: file,
                id: req.body.id
            }          
            
            await Chef.update(data);

            if (req.body.removed_avatar != "" && req.files.length == 1) {
                const removedFile = req.body.removed_avatar;
                await File.delete(removedFile);
            }

            const results = await Chef.find(req.body.id);
            let chef = results.rows[0];

            const avatarChef = await findImageChef(req, req.body.id);

            chef = {
                ...chef,
                avatar: avatarChef
            }

            const userSession = await findUserSession(req.session.userID);
            
            return res.render("admin/chefs/edit", {
                chef,
                userSession,
                success: "Chef atualizado com sucesso!"
            });

        }catch(err) {
            console.error(err);
        }
        
    },

    async delete(req, res) {

        try {
            await Chef.delete(req.body.id);
            await File.delete(req.body.file_id);

            return res.redirect("/admin/chefs/deleted_point");

        }catch(err) {
            console.error(err);
        }
        
    },
    
    deleted_point(req, res) {
        
        return res.render("admin/chefs/deleted_point");        
    }
    
}