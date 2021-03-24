
const User = require("../models/User");

async function findUserSession(id) {        
    const userSession = await User.findOne({ where: { id }});
    return userSession;
}


module.exports = {    

    async list(req, res) {
        const users = await User.findAllUsers();
        
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
        
        await User.create(req.body);
        
        const users = await User.findAllUsers();
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
            const users = await User.findAllUsers();
           
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
            
            const users = await User.findAllUsers();
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