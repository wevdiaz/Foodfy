const db = require("../../config/db");
const Base = require("./Base");
const fs = require("fs");

Base.init({ table: "files"});

module.exports = {
    ...Base,    

    async delete(id) {

        try {            
            
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
            const file = result.rows[0]                                

            fs.unlinkSync(file.path)

            return db.query(`
                DELETE FROM files WHERE id = $1
            `, [id]);

        } catch(err) {
            console.log("Erro ao deletar dados: " + err);
        }
        
    },

    async getIdFiles(id) {
        const results =  await db.query(`SELECT * FROM recipe_files WHERE id = $1 `, [id]);
        return results.rows[0].file_id;
    }    

}