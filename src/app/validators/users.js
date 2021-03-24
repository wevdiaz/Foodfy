const User = require("../models/User");
const { compare } = require("bcryptjs");

function checkAllFields(body) {

    const keys = Object.keys(body);

        for (key of keys) {
            if (body[key] == "") {
                return  {
                    user: body,
                    error: "Por favor, Preencha todos os campos!"
                };
            } 
        }
}

async function index(req, res, next) {
    const { userID: id } = req.session;

        const user = await User.findOne({ where: { id }});

        if (!user) return res.render("admin/user/register", {
            error: "Usuário não encontrado"
        });

        req.user = user;

        next();
}

async function post(req, res, next) {
    
        const fillAllFields = checkAllFields(req.body);

        if (fillAllFields) {
            
            return res.render("admin/user/register", fillAllFields);
        }

        const { email } = req.body;

        const user = await User.findOne({ where: { email }});

        if (user) return res.render("admin/user/register", {
            user: req.body,
            error: "Usuário já cadastrado!"
        });

        next();
}

async function put(req, res, next) {
    const fillAllFields = checkAllFields(req.body);

    if (fillAllFields) {
        return res.render("admin/user/index", fillAllFields );
    }

    const { id, password } = req.body;

    if (!password) {
        return res.render("admin/user/index", {
            user: req.body,
            error: "Digite sua senha para atualizar seu cadastro "
        });
    }

    const user = await User.findOne({ where: { id }});
    
    const passed = await compare(password, user.password);

    if (!passed) {
        return res.render("admin/user/index", {
            user: req.body,
            error: "Senha inválida"
        });
    }

    req.user = user;

    next();

}

async function updateUser(req, res, next) {
    const fillAllFields = checkAllFields(req.body);

    if (fillAllFields) {
        return res.render("admin/user/edit", fillAllFields );
    }

    const { id } = req.body; 

    const user = await User.findOne({ where: { id }});

    req.user = user;

    next();
}

module.exports = {
    index,
    post,
    put,
    updateUser
}