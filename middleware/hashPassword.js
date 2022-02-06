const argon2 = require('../lib/argon2');

function hash(req, res, next) {

    const { password } = req.checkedBody.user;

    const { err, hash } = argon2.hash(password);

    if (!err) {
        console.log('[ERROR] err:', err);

        res.sendStatus(500); // Internal server error
    }

    req.checkedBody.user.password = hash;

    next();
}

module.exports = {
    hash
}