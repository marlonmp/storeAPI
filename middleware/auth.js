const JWT = require('../lib/jwt');

function verifyToken(req, res, next) {

    const { token } = req.cookies;

    const { err, claims } = JWT.verify(token);

    if (err) return res.sendStatus(403); // Forbidden

    req.jwt = { claims };

    next();
}

function verifyIfIsOwner(req, res, next) {

    const { roleId } = req.jwt.claims;

    if (roleId != 2) return res.sendStatus(401); // Unauthorized

    next();
}

module.exports = {
    verifyToken,
    verifyIfIsOwner
}