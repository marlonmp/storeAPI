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

function formatSets(obj = {}) {

    let query = '';

    const args = [];

    let i = 1;

    Object.entries(obj).forEach(([key, value]) => {

        if (value) {
            query += ` "${key}" = $${i},`;
            
            args.push(value);

            i++;
        }
    });

    query = query.slice(0, -1);

    return { query, args };
}

module.exports = {
    exec,
    formatSets
}