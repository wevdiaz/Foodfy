const db = require("../../config/db");
const Base = require("./Base");

const { foundDate } = require("../../lib/utils");

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

    // create(data) {

    //     const query = `
    //         INSERT INTO chefs (
    //             name,
    //             file_id,
    //             created_at
    //         ) VALUES ($1, $2, $3)
    //         RETURNING id
    //     `

    //     const values = [
    //         data.name,
    //         data.file_id,
    //         foundDate(Date.now()).iso
    //     ]

    //     return db.query(query, values);

    // },

    // async findTotalRecipe(id) {

    //     const results = await db.query(`
    //         SELECT chefs.*, count(recipes) AS total_recipes
    //         FROM chefs 
    //         LEFT JOIN recipes ON (recipes.chef_id = chefs.id)           
    //         WHERE chefs.id = $1
    //         GROUP BY chefs.id `, [id]);

    //     return results.rows[0];        
    // },

    // update(data) {

    //     const query = `
    //         UPDATE chefs SET
    //             name=($1),
    //             file_id=($2)
    //         WHERE id = $3
    //     `

    //     const values = [
    //         data.name,
    //         data.file_id,
    //         data.id
    //     ]

    //     return db.query(query, values);
    // },

    // delete(id) {
    //     return db.query(`DELETE FROM chefs WHERE id = $1`, [id]);
    // },
    
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