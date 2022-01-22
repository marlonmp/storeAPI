const { exec, formatSets } = require('../db/queries');

/** @param { Product } product */
async function insert(product = {}) {
    
    const query = `INSERT INTO "product" ("name", "description", "price", "sales") VALUES ($1,$2,$3,$4);`;

    const { err, res } = await exec(query, [product.name, product.description, product.price, 0]);

    if (err != null) return { err, rows: null };

    const { rowCount } = res;
    
    return { err, rowCount };
    
}

// SELECT "name", "description", "price", "sales" FROM "product" WHERE ("name" LIKE '%is%' OR "description" LIKE '%is%') AND ("price" BETWEEN 12.00 AND 40.00);

async function getById(id = 0) {

    const query = `SELECT "name", "price", "description", "sales" FROM "product" WHERE "id" = $1;`;

    const { err, res } = await exec(query, [id]);

    if (err != null) return { err, rows: null };

    const { rows } = res;
    
    return { err, rows };
}

/** @param { Product } newProduct */
async function update(id = 0, newProduct = {}) {

    let { query, args } = updateQueryFormatter('product', id, newProduct);

    const { err, res } = await exec(query, args);

    if (err != null) return { err, rowCount: null };

    const { rowCount } = res;
    
    return { err, rowCount };

}

async function search(query = '', minPrice = 0, maxPrice = 0) {

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