const argon2 = require('argon2');

async function hash(password = '') {

    try {

        return {
            hash: await argon2.hash(password)
        };

    } catch(err) {

        return { err };
    }
}

async function verify(hash = '', password = '') {

    try {

        return {
            isEqual: await argon2.verify(hash, password)
        };

    } catch(err) {

        return { err };
    }
}

module.exports = {
    hash,
    verify
};