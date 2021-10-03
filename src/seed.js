const crypto = require("crypto");
// const mailer = require("../../lib/mailer");
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
}

createUsers();