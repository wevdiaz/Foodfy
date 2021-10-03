const Chef = require("../models/chef");
const Recipe = require("../models/recipe");
const File = require("../models/File");
const User = require("../models/User");

const { foundDate } = require("../../lib/utils");

async function findChef(req, id) {
    let chef = await Chef.find(id); 

    let avatarChef = await Chef.getImageChef(chef.id);     
    chef.avatar = `${req.protocol}://${req.headers.host}${avatarChef.image.replace("public", "")}`;    
    return chef;
}

async function findUserSession(id) {
    const userSession = await User.findOne({ where: { id }});
    return userSession;
}

async function findImageChef(req, id) {
    let avatarChef = await Chef.getImageChef(id);    
    avatarChef = `${req.protocol}://${req.headers.host}${avatarChef.image.replace("public", "")}`;
    return avatarChef;
}

module.exports = {

    async index(req, res) { 
        
        try {
            let chefs = await Chef.all();            

            const chefsAvatarPromise = chefs.map(async function(chef) {
            
                let avatarChef = await Chef.getImageChef(chef.id);                
                chef.avatar = `${req.protocol}://${req.headers.host}${avatarChef.image.replace("public", "")}`;              

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
            let chef = await Chef.find(req.params.id);            
            
            if (!chef) return res.send("Chef not found");

            let avatarChef = await Chef.getImageChef(chef.id);            
            chef.avatar = `${req.protocol}://${req.headers.host}${avatarChef.image.replace("public", "")}`;                 

            let recipes = await Chef.findRecipes(chef.id);            
                    
            if (recipes[0].id != null) {
                const recipesPromises = recipes.map(async function(recipe) {
                    const file = await Recipe.files(recipe.id);                    
                
                    recipe.imageFeatured = `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`;            
                    return recipe;
                })
        
                recipes = await Promise.all(recipesPromises);

                chef.total_recipes = recipes.length;
                
                const id = req.session.userID;
                const userSession = await User.findOne({ where: { id }});
                
                return res.render("admin/chefs/show", { chef, chefRecipes: recipes, userSession });
            }
            else  {

                const id = req.session.userID;
                const userSession = await User.findOne({ where: { id }});
                chef.total_recipes = 0;

                return res.render("admin/chefs/show", { chef, chefRecipes: recipes, userSession });
            }

        }catch(err) {
            console.error(err);
        }       
    },

    async post(req, res) {

       try {
            const { filename, path } = req.files[0];                   
            
            const file = await File.create({ name: filename, path: path });
            
            const data = {
            name: req.body.name,
            file_id: file,
            created_at: foundDate(Date.now()).iso
            }      
    
            const chefId = await Chef.create(data);            
            
            let chef = await findChef(req, chefId);
            chef.total_recipes = 0;

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
            let chef = await Chef.find(req.params.id);

            if(!chef) return res.send("Chef not found!");        

            let avatarChef = await Chef.getImageChef(chef.id);            
            chef.avatar = `${req.protocol}://${req.headers.host}${avatarChef.image.replace("public", "")}`;                         

            return res.render("admin/chefs/edit", { chef });

        }catch(err) {
            console.error(err);
        }

    },

    async put(req, res) {

        try {   
            let file = req.body.file_id;              

            if (req.files.length != 0) {
                const { filename, path } = req.files[0];
                file = await File.create({ name: filename, path: path });
            }

            const data = {
                name: req.body.name,
                file_id: file
            }          
            
            await Chef.update(req.body.id, data);

            if (req.body.removed_avatar != "" && req.files.length == 1) {
                const removedFile = req.body.removed_avatar;
                await File.delete(removedFile);
            }

            let chef = await Chef.find(req.body.id);

            chef.avatar = await findImageChef(req, req.body.id);            

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

            const itemDeleted = "Cadastro deletado";
            return res.render("admin/parts/success-delete", { itemDeleted });

        }catch(err) {
            console.error(err);
        }        
    }   
    
}