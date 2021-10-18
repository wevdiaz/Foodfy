const crypto = require("crypto");
const mailer = require("./lib/mailer");
const faker = require("faker");

const { hash } = require("bcryptjs");

const User = require("./app/models/User");

async function createUsers() {
    
    const users = [];

    const passwordToken = crypto.randomBytes(4).toString("hex");
    const passwordHash = await hash(passwordToken, 8);

    while( users.length < 3) {

        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password: passwordHash,
            is_admin: Math.round(Math.random()) >= 1 ? true : false
        });
    }

    const usersPromise = users.map( user => User.create(user));

    await Promise.all(usersPromise);

    sendEmailToUser(users, passwordToken);
}

function sendEmailToUser(users, token) {
    
    users.forEach(async user => {
        await mailer.sendMail({
            to: user.email,
            from: "no-reply@foodfy.com.br",
            subject: "Olá! Seja bem Vindo ao Foodfy",
            html: `<h2>Olá, ${user.name}</h2>

            <p> Seja bem vindo ao Foodfy! Você agora poderá criar receitas em nosso site.</p>

            <p>
                Para você fazer login em nossa aplicação, você poderá utiizar essa <strong>Senha</strong>: ${token}
            </p>
                       
            `
        });
    });
}

createUsers();