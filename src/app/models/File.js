const db = require("../../config/db");
const Base = require("./Base");
const fs = require("fs");

Base.init({ table: "files"});

module.exports = {
    ...Base,

    // Vamos testar a do Base  agora
    // create({filename, path}) {

    //     const query = `
    //         INSERT INTO files (
    //             name,
    //             path
    //         ) VALUES ($1, $2)
    //         RETURNING id
    //     `

    //     const values = [
    //         filename,
    //         path
    //     ]

    //     return db.query(query, values);
    // },

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

    getIdFiles(id) {
        return db.query(`SELECT * FROM recipe_files WHERE id = $1 `, [id]);
    }    

}