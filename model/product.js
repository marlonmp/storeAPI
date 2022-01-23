const { exec, updateQueryFormatter } = require('../db/queries');
const util = require('util');

/** @param { Product } product */
async function insert(product = {}) {
    
    const query = `INSERT INTO "product" ("name", "description", "price", "sales") VALUES ($1,$2,$3,$4);`;

    const { err, res } = await exec(query, [product.name, product.description, product.price, 0]);

    if (err != null) return { err, rows: null };

    const { rowCount } = res;
    
    return { err, rowCount };
    
}

// SELECT "name", "description", "price", "sales" FROM "product" WHERE ("name" ILIKE '%is%' OR "description" ILIKE '%is%') AND ("price" BETWEEN 12.00 AND 40.00);

const filters = {
    ILinke: ` ("name" ILIKE $%d OR "description" ILIKE $%d)`,
    minPrice: ` "price" >= $%d`,
    maxprice: ` "price" <= $%d`
}

function searchQueryFormatter(...objs) {

    let query = `SELECT "name", "description", "price", "sales" FROM "product" WHERE`;

    const args = [];

    const objsLen = objs.length;

    let isTheFilterAdded = false;

    for (let i = 0; i < objsLen; i++) {
        
        if (objs[i].value) {
            if (isTheFilterAdded) query += ` AND`;

            args.push(objs[i].value);

            query += objs[i].filter.replace(/\%d/g, args.length);

            if (!isTheFilterAdded) isTheFilterAdded = true;
        }
    }

    query += ';';

    return { query, args };
}

async function search(search = '', minPrice = 0, maxPrice = 0) {
    
    const { query, args } = searchQueryFormatter(
        { filter: filters.ILinke, value: search ? `%${search}%` : '' },
        { filter: filters.minPrice, value: minPrice },
        { filter: filters.maxprice, value: maxPrice }
    );
    
    const { err, res } = await exec(query, args);

    if (err != null) return { err, rows: null };

    const { rows } = res;
    
    return { err, rows };
    
}

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

async function remove(id = 0) {

    const query = `DELETE FROM "product" WHERE "id" = $1`;

    const { err, res } = await exec(query, [id]);

    if (err != null) return { err, rowCount: null };

    const { rowCount } = res;
    
    return { err, rowCount };

}

module.exports = {
    insert,
    search,
    getById,
    update,
    remove
};