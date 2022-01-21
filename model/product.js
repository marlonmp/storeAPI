const { exec, formatSets } = require('../db/queries');

/** @param { Product } product */
async function insert(product = {}) {
    
    const query = `INSERT INTO "product" ("name", "description", "price", "sales") VALUES ($1,$2,$3,$4);`;

    const { err, res } = await exec(query, [product.name, product.description, product.price, 0]);

    if (err != null) return { err, rows: null };

    const { rowCount } = res;
    
    return { err, rowCount };
    
}

async function getById(id = 0) {

    const query = `SELECT "name", "price", "description" FROM "product" WHERE "id" = $1;`;

    const { err, res } = await exec(query, [id]);

    if (err != null) return { err, rows: null };

    const { rows } = res;
    
    return { err, rows };
}

/** @param { Product } newProduct */
async function update(id = 0, newProduct = {}) {

    let query_ = `UPDATE "product" SET`;

    let { query, args } = formatSets(newProduct);

    query = query_ + query + ` WHERE "id" = $${args.length + 1};`;

    args.push(id);

    const { err, res } = await exec(query, args);

    if (err != null) return { err, rowCount: null };

    const { rowCount } = res;
    
    return { err, rowCount };

}

async function remove(id = 0) {

    const query = `DELETE FROM "product" WHERE "id" = $1`;

    const { err, res } = await exec(query, [id]);

    if (err != null) return { err, rowCount: null };

    const { rowCount } = res;
    
    return { err, rowCount };

}

module.exports = {
    insert,
    getById,
    update,
    remove
};