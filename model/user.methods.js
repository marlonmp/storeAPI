const argon2 = require('../lib/argon2');

/** @param { User } user */
async function setHash(user) {
    if (user.password) {
        const { err, hash } = argon2.hash(user.password);

        user.password = hash ? hash : '';

        return { err };
    }
}

module.exports = {
    setHash
};