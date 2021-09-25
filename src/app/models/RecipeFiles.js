const db = require("../../config/db");
const Base = require("./Base");

Base.init({ table: "recipe_files" });

module.exports = {

    ...Base,    

    async getIdFiles(id) {        
        const results =  await db.query(`SELECT * FROM recipe_files WHERE id = $1 `, [id]);
        return results.rows[0].file_id;
    }
}