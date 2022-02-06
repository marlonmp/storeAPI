const { pool } = require('./conn');

/** @type { Exec } */
async function exec(query, args) {

    try {

        const res = await pool.query(query, args);

        return { ...res };

    }
    catch(err) {

        return { err };
    }
}

module.exports = {
    exec
}