const db = require("../../config/db");
const Recipe = require("../models/recipe");
const File = require("../models/File");

const Base = require("./Base");

Base.init({ table: "users"});

module.exports = {

    ...Base,    
   
    async showAllUsersInOrder() {
        const query = "SELECT * FROM users ORDER BY name";
        const results = await db.query(query);
        return results.rows;
    },    

    async delete(id) {
        
        try {
            const recipes = await Recipe.findByUserRecipe(id);
            
            const allFilesPromise = recipes.map(recipe => Recipe.allFiles(recipe.id));

            let promiseResults = await Promise.all(allFilesPromise);
            await db.query("DELETE FROM users WHERE id= $1", [id]);
            
            promiseResults.map(results => {
                
                results.map(result => {                   
                    File.delete(result.file_id)
                });
            });

        }catch(err) {
            console.error(err);
        }
    }
}