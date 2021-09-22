const db = require("../../config/db");
const crypto = require("crypto");
const mailer = require("../../lib/mailer");
const { hash } = require("bcryptjs");
const fs = require("fs");

const Recipe = require("../models/recipe");
const File = require("../models/File");

const Base = require("./Base");

Base.init({ table: "users"});

module.exports = {

    ...Base,

    // async findOne(filters) {

    //     let query = "SELECT * FROM users";

    //     Object.keys(filters).map(key => {
    //         query = `${query}
    //             ${key}
    //         `
    //         Object.keys(filters[key]).map(field => {
    //             query = `${query} ${field} = '${filters[key][field]}'`
    //         });
    //     });

    //     const results = await db.query(query);
    //     return results.rows[0];
    // },
   
    async showAllUsersInOrder() {
        const query = "SELECT * FROM users ORDER BY name";
        const results = await db.query(query);
        return results.rows;
    },

    // async create(data) {
        
    //     try {

    //         const query = `
    //             INSERT INTO users (
    //                 name,
    //                 email,
    //                 password,
    //                 is_admin                    
    //             ) VALUES ($1, $2, $3, $4)
    //             RETURNING id
    //         `

    //         // senha será gerada via token
    //         const passwordToken = crypto.randomBytes(4).toString("hex");

                      
    //         const passwordHash = await hash(passwordToken, 8);

    //         const values = [
    //             data.name,
    //             data.email,
    //             passwordHash,                
    //             data.is_admin || false             
    //         ]            

    //     const results = await db.query(query, values);

    //     //Envio
    //     await mailer.sendMail({
    //         to: data.email,
    //         from: "no-reply@foodfy.com.br",
    //         subject: "Olá! Seja bem Vindo ao Foodfy",
    //         html: `<h2>Olá, ${data.name}</h2>

    //         <p> Seja bem vindo ao Foodfy! Você agora poderá criar receitas em nosso site.</p>

    //         <p>
    //             Para você fazer login em nossa aplicação, você poderá utiizar essa <strong>Senha</strong>: ${passwordToken}
    //         </p>
                       
    //         `
    //     });

    //     return results.rows[0].id;

    //     }catch(err) {
    //         console.error(err);
    //         console.log("Houve um erro inesperado!")
    //     }
    // },

    // async update(id, fields) {
    //     let query = "UPDATE users SET";

    //     Object.keys(fields).map((key, index, array) => {
    //         if (index + 1 < array.length) {
    //             query = `${query}
    //                 ${key} = '${fields[key]}',
    //             `
    //         }
    //         else {
    //             query = `${query}
    //                 ${key} = '${fields[key]}'
    //                 WHERE id = ${id}
    //             `
    //         }           
    //     });

    //     await db.query(query);
    //     return;
    // },

    async delete(id) {
        
        try {
            const recipes = await Recipe.findByUserRecipe(id);
            // let results = await Recipe.findByUserRecipe(id);
            // const recipes = results.rows;
            
            const allFilesPromise = recipes.map(recipe => Recipe.allFiles(recipe.id));

            let promiseResults = await Promise.all(allFilesPromise);
            // console.log(promiseResults);
            // return;
            await db.query("DELETE FROM users WHERE id= $1", [id]);
            
            promiseResults.map(results => {
                // console.log(results);
                // console.log("------------------------");
                // console.log(results.rows);
                results.map(result => {                   
                    File.delete(result.file_id)
                });
            });

        }catch(err) {
            console.error(err);
        }
    }
}