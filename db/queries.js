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

function updateQueryFormatter(table = '', id = 0, obj = {}) {
    
    let query = `UPDATE "${table}" SET`;
    
    const args = [id];
    
    let i = 2;
    
    Object.entries(obj).forEach(([key, value]) => {
        
        if (value) {
            query += ` "${key}" = $${i},`;
            
            args.push(value);
            
            i++;
        }
    });
    
    query = query.slice(0, -1) + ` WHERE "id" = $1;`;

    return { query, args };
}

module.exports = {
    exec,
    updateQueryFormatter
}