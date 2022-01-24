const JWT = require('../lib/jwt');

function verifyToken(req, res, next) {

    const { token } = req.cookies;

    const { err, claims } = JWT.verify(token);

    if (err) return res.sendStatus(403); // Forbidden

    req.jwt = { claims };

    next();
}

module.exports = {
    verifyToken
}