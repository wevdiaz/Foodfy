const db = require("../../config/db");
const { checkItemAdd } = require("../../lib/utils");

const Base = require("./Base");

Base.init({ table: "recipes"});

module.exports = {

    all(){

        return db.query(`SELECT recipes.*, chefs.name AS chef_name 
                  FROM recipes
                  LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                  ORDER BY created_at DESC
                  `);
                          
    },

    create(data){

        const query = `
            INSERT INTO recipes (
                chef_id,                
                title,
                ingredients,
                preparation,
                information,
                user_id                               
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `

        const values = [
            data.chef_id,            
            data.title,
            checkItemAdd(data.ingredients),
            checkItemAdd(data.preparation),
            data.information,
            data.user_id                       
        ]


        return db.query(query, values);

    },

    find(id){

        return db.query(`
            SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id= $1`,[id]);
    },

    update(data){

        const query = `
            UPDATE recipes SET
                chef_id=($1),                
                title=($2),
                ingredients=($3),
                preparation=($4),
                information=($5)                
            WHERE id = $6
        `

        const values = [
            data.chef_id,            
            data.title,
            checkItemAdd(data.ingredients),
            checkItemAdd(data.preparation),
            data.information,            
            data.id
        ]

        return db.query(query, values);
    },

    delete(id){
        return db.query(`DELETE FROM recipes WHERE id = $1`, [id]);
    },

    files(id) {
        return db.query(`
            SELECT recipe_files.*,
            files.name AS name, files.path AS path, files.id AS file_id
            FROM recipe_files
            LEFT JOIN files ON (recipe_files.file_id = files.id)
            WHERE recipe_id = $1
        `, [id]);
    },

    chefsSelectOptions() {
        return db.query(`SELECT name, id FROM chefs`);
    },

    findBy(filter) {

        return db.query(`
            SELECT recipes.*, chefs.name AS name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.title ILIKE '%${filter}%'
            ORDER BY recipes.updated_at DESC`);
    },

    paginate(params) {
        const { filter, limit, offset, callback } = params;

        let totalQuery = `(
            SELECT count(*) FROM recipes
        ) As total`

        let query = `SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
                     FROM recipes
                     LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                     ORDER BY created_at DESC`;

        
                     query = `${query}                        
                        LIMIT $1 OFFSET $2                        
                        `;

        
        db.query(query, [limit, offset], function(err, results){
            if (err) throw `Database Error! ${err}`;

            callback(results.rows);
            
        });                    

    },

    paginateUser(params) {
        const { limit, offset, callback, id } = params;

        let totalQuery = `(
            SELECT count(*) 
            FROM recipes
            LEFT JOIN users ON (recipes.user_id = users.id)
            WHERE users.id = $3
        ) As total`

        let query = `SELECT recipes.*, ${totalQuery}, users.name AS user_name
                     FROM recipes
                     LEFT JOIN users ON (recipes.user_id = users.id)
                     WHERE users.id = $3
                     ORDER BY created_at DESC`;

        
                     query = `${query}                        
                        LIMIT $1 OFFSET $2                        
                        `;

        
        db.query(query, [limit, offset, id], function(err, results){
            if (err) throw `Database Error! ${err}`;

            callback(results.rows);
            
        });                    

    },

    findByUserRecipe(id) {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE user_id = $1`, [id]);
    }
}