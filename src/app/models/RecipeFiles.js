const db = require("../../config/db");
const Base = require("./Base");

Base.init({ table: "recipe_files" });

module.exports = {

    create(data) {

        const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ($1, $2)
            RETURNING id
        `

        const values = [
            data.recipeID,
            data.fileID
        ]

        return db.query(query, values);
    },

    delete(id) {
        return db.query(`
            DELETE FROM recipe_files WHERE id = $1 `, [id]);
    },

    getIdFiles(id) {
        return db.query(`SELECT * FROM recipe_files WHERE id = $1`, [id]);
    }
}