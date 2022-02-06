const { exec, updateQueryFormatter } = require('../db/queries');

/** @param { User } user */
async function insert(user = {}) {

    const query = `CALL new_user($1,$2,$3,$4,$5);`;

    return { err, rowCount } = await exec(query, [user.role, user.firstName, user.lastName, user.email, user.password]);
}

async function signIn(email = '') {

    const query = `SELECT sign_in($1)`;

    return { err, rows } = await exec(query, [email]);
}

async function getById(id = 0) {

    const query = `SELECT get_user($1);`;

    return { err, rows } = await exec(query, [id]);
}

/** @param { User } newUser */
async function update(id = 0, newUser = {}) {

    const query = `CALL update_user($1,$2,$3,$4,$5);`;

    return { err, rowCount } = await exec(query, [id, newUser.firstName, newUser.lastName, newUser.email, newUser.password]);
}

async function remove(id = 0) {

    const query = `CALL delete_user($1);`;

    return { err, rowCount } = await exec(query, [id]);
}

module.exports = {
    insert,
    signIn,
    getById,
    update,
    remove
};