const userMdl = require('../model/user');

const argon2 = require('../lib/argon2');
const JWT = require('../lib/jwt');

async function signUp(req, res) {

    const { err, rowCount } = await userMdl.insert(req.checkedBody.user);

    if (err) {
        console.log('[ERROR] err:', err);

        return res.sendStatus(500); // Internal Server Error
    }

    if (rowCount == 0) return res.sendStatus(409); // Conflict

    res.sendStatus(200); // Ok
}

async function signIn(req, res) {

    const { user } = req.checkedBody;

    const { err, rows } = userMdl.signIn(user.email);

    if (err) {
        console.log('[ERROR] err:', err);

        return res.sendStatus(500); // Internal Server Error
    }

    const userSelected = rows[0];

    const { verifyErr, isEqual } = await argon2.verify(userSelected.password, user.password);

    if (verifyErr) {
        console.log('[ERROR] verifyErr:', verifyErr);

        return res.sendStatus(500); // Internal Server Error
    }

    if (!isEqual) return res.sendStatus(401); // Unauthorized

    const { tokenErr, token } = JWT.sign({
        userId: userSelected.id,
        roleId: userSelected.role_id
    });

    if (tokenErr) {
        console.log('[ERROR] tokenErr:', tokenErr);

        return res.sendStatus(500); // Internal Server Error
    }

    res
        .cookie('token', token)
        .sendStatus(200); // Ok
}

async function getAccount(req, res) {

    const { err, rows } = userMdl.getById(req.checkedParams.id);

    if (err) {
        console.log('[ERROR] err:', err);

        return res.sendStatus(500); // Internal Server Error
    }

    res
        .status(200) // Ok
        .json(rows[0]);
}

async function update(req, res) {

    const { user } = req.checkedBody;

    const { id } = req.checkedParams;

    const { err, rowCount } = await userMdl.update(id, user);

    if (err) {
        console.log('[ERROR] err:', err);

        return res.sendStatus(500); // Internal Server Error
    }

    if (rowCount == 0) return res.sendStatus(404); // Not found

    res.sendStatus(200); // Ok
}

async function remove(req, res) {

    const { err, rowCount } = await userMdl.remove(req.checkedParams.id);

    if (err) {
        console.log('[ERROR] err:', err);

        return res.sendStatus(500); // Internal Server Error
    }

    if (rowCount == 0) return res.sendStatus(404); // Not found

    res.sendStatus(200); // Ok
}


module.exports = {
    signUp,
    signIn,
    getAccount,
    update,
    remove
};