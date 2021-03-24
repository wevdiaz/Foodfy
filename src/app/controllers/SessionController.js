const User = require("../models/User");

const { hash } = require("bcryptjs");
const crypto = require("crypto");
const mailer = require("../../lib/mailer");

module.exports = {
    loginForm(req, res) {
        return res.render("admin/session/login");
    },

    login(req, res) {
        req.session.userID = req.user.id;
        
        return res.render("admin/user/index", {
            user: req.user,            
            success: "Você está conectado na sua conta!"
        });
    },

    logout(req, res) {
        req.session.destroy();
        return res.render("admin/session/login", {
            success: "Você se desconectou da sua conta com sucesso!"
        });
    },

    forgotForm(req, res) {
        return res.render("admin/session/forgot-password");
    },

    async forgot(req, res) {

        const user = req.user;

        try {

            const token = crypto.randomBytes(20).toString("hex");

            let now = new Date();
            now = now.setHours(now.getHours() + 1);

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            });

            await mailer.sendMail({
                to: user.email,
                from: "no-reply@foodfy.com.br",
                subject: "Recuperação de senha",
                html: `<h2>Esqueceu a senha? Calma!</h2>
                <p>Não se preocupe, clique no link abaixo para cadastrar uma nova senha</p>

                <p>
                    <a href="http://localhost:3000/admin/users/password-reset?token=${token}" target="_blank">RECUPERAR SENHA</a>
                </p>
                `
            });
            
            return res.render("admin/session/forgot-password", {
                user,
                success: "Verifique sua caixa de e-mail para alterar a senha"
            });

        }catch(err){
            console.error(err);
            return res.render("admin/session/forgot-password", {
                error: "Erro inesperado! Tente novamente."
            });
        }        
    },

    resetForm(req, res) {
        
        return res.render("admin/session/password-reset", { token: req.query.token });
    },

    async reset(req, res) {
        const { user } = req;
        const { password, token } = req.body;

        try {

            const newPassword = await hash(password, 8);

            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            });

            return res.render("admin/session/login", {
                user: req.body,
                success: "Senha atualizada com sucesso!"
            });

        }catch(err) {
            console.error(err);
            return res.render("admin/session/password-reset", {
                user: req.body,
                token,
                error: "Erro inesperado, tente novamente!"
            });

        }
    }
}