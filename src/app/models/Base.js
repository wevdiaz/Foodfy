const db = require("../../config/db");

const Base = {

    init({ table }){
        if(!table) throw new Error("Invalid Params");

        this.table = table;

        return this;
    },

    async findOne(filters) {
        let query = `SELECT * FROM ${this.table}`;

        Object.keys(filters).map( key => {
            query += ` ${key}`;

            Object.keys(filters[key]).map( field => {
                query += ` ${field} = '${filters[key][field]}'`
            });
        });

        const results = await db.query(query);
        return results.rows[0];
    }
}

module.exports = Base;