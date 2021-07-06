const crypto = require("crypto");
const mailer = require("../../lib/mailer");

const { hash } = require("bcryptjs");

const User = require("../models/User");

async function findUserSession(id) {        
    const userSession = await User.findOne({ where: { id }});
    return userSession;
}


module.exports = {    

    async list(req, res) {
        
        const users = await User.showAllUsersInOrder();
        
        const userSession =  await findUserSession(req.session.userID);                 
        
        return res.render("admin/user/list", { users, userSession });
    },

    async registerForm(req, res) {

        const userSession =  await findUserSession(req.session.userID);

        return res.render("admin/user/register", { userSession });
    },

    async edit(req, res) {
                
        let { id } = req.params;
        
        const user = await User.findOne({ where: { id }});

        const userSession =  await findUserSession(req.session.userID);       
        
        return res.render("admin/user/edit", { user, userSession });
    },
    
    async post(req, res) {
        
        const passwordToken = crypto.randomBytes(4).toString("hex");
        const passwordHash = await hash(passwordToken, 8);
        
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: passwordHash,
            is_admin: req.body.is_admin || false
        });

        await mailer.sendMail({
            to: req.body.email,
            from: "no-reply@foodfy.com.br",
            subject: "Olá! Seja bem Vindo ao Foodfy",
            html: `<h2>Olá, ${req.body.name}</h2>

            <p> Seja bem vindo ao Foodfy! Você agora poderá criar receitas em nosso site.</p>

            <p>
                Para você fazer login em nossa aplicação, você poderá utiizar essa <strong>Senha</strong>: ${passwordToken}
            </p>
                       
            `
        });
        
        const users = await User.showAllUsersInOrder();
        const userSession = await findUserSession(req.session.userID);

        return res.render("admin/user/list", {
            users,
            userSession,
            success: "Novo usuário cadastrado com sucesso!"
        });

    },

    async put(req, res) {

        try {
            const { user } = req;
            let { name, email, is_admin } = req.body;

            if (!is_admin) {
                is_admin = false;
            }

            await User.update(user.id, {
                name,
                email,
                is_admin
            });

            const userSession =  await findUserSession(req.session.userID);
            const users = await User.showAllUsersInOrder();
           
            return res.render("admin/user/list", {
                users,
                userSession,               
                success: "Conta atualizada com sucesso!"               
            });

        }catch(err) {
            console.error(err);
            return res.render("admin/user/edit", {
                error: "Algum erro aconteceu!"
            });            
        }
    },

    async delete(req, res) {

        try {
           
            await User.delete(req.body.id);  
            
            const users = await User.showAllUsersInOrder();
            const userSession =  await findUserSession(req.session.userID);

            return res.render("admin/user/list", {
                users,
                userSession,
                success: "Conta deletada com sucesso!"
            });

        }catch(err) {
            console.error(err);
            return res.render("admin/user/list", {
                users,
                userSession,
                error: "Erro ao tentar deletar usuário"
            });
        }
    }

    
}