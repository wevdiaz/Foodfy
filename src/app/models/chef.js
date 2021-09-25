const db = require("../../config/db");
const Base = require("./Base");

Base.init({ table: "chefs"});

module.exports = {

    ...Base,

    async all() {

        const results = await db.query(`SELECT chefs.*, count(recipes) AS total_recipes 
                  FROM chefs
                  LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
                  GROUP BY chefs.id
                  ORDER BY name ASC`);
        
        return results.rows;        
    },    
    
    async findRecipes(id) {

        const results = await db.query(`
            SELECT chefs.*, recipes.*
            FROM chefs 
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)           
            WHERE chefs.id = $1
            ORDER BY recipes.created_at DESC `, [id] );
        
        return results.rows;        
    },
    
    async getImageChef(id) {
        const results = await db.query(`
            SELECT chefs.*, files.path AS image
            FROM chefs
            LEFT JOIN files ON (chefs.file_id = files.id)
            WHERE chefs.id = $1
        `, [id]);

        return results.rows[0];
    }
    
}