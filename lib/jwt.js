require('dotenv').config();

const JWT = require('jsonwebtoken');

const { EXPIRES_IN, SECRET_KEY } = process.env

function sign(claims = {}) {

    try {

        const token = JWT.sign(claims, SECRET_KEY, { expiresIn: EXPIRES_IN });

        return { token };

    } catch(err) {

        return { err };
    }
}

function verify(token) {

    try {

        const claims = JWT.verify(token, SECRET_KEY);

        return { claims };

    } catch(err) {

        return { err };
    }
}

module.exports = {
    sign,
    verify
}