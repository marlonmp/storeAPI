const { pool } = require('./conn');

/** @type { Exec } */
async function exec(query, args) {

    try {

        const res = await pool.query(query, args);

        pool.end();

        return { err: null, res };

    }
    catch(err) {

        pool.end();

        return { err, res: null };
    }
}

module.exports = {
    exec
}