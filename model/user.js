const { exec, updateQueryFormatter } = require('../db/queries');

/** @param { User } user */
async function insert(user = {}) {

    const query = `INSERT INTO "user" ("role_id","first_name","last_name","email","password") VALUES (1,$1,$2,$3,$4);`;

    return { err, rowCount } = await exec(query, [user.firstName, user.lastName, user.email, user.password]);
}

async function getById(id = 0) {

    const query = `SELECT "role_id","first_name","last_name","email" FROM "user" WHERE "id" = $1;`;

    return { err, rows } = await exec(query, [id]);
}

/** @param { User } newUser */
async function update(id = 0, newUser = {}) {

    const { query, args } = updateQueryFormatter("user", id, newUser);

    return { err, rowCount } = await exec(query, args);
}

async function remove(id = 0) {

    const query = `DELETE FROM "user" WHERE "id" = $1;`;

    return { err, rowCount } = await exec(query, [id]);
}

module.exports = {
    insert,
    getById,
    update,
    remove
};