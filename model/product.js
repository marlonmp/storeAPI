const { exec } = require('../db/queries');
const util = require('util');

/** @param { Product } product */
async function insert(product = {}) {
    
    const query = `CALL new_product($1,$2,$3);`;

    return { err, rowCount } = await exec(query, [product.name, product.price, product.description]);
}

async function search(queries) {
    
    const query = `SELECT search_products($1,$2,$3);`;

    return { err, rows } = await exec(query, [queries.query, queries.minPrice, queries.maxPrice]);
    
}

async function getById(id = 0) {

    const query = `SELECT get_product($1);`;

    return { err, rows } = await exec(query, [id]);
}

/** @param { Product } newProduct */
async function update(id = 0, newProduct = {}) {

    const query = `CALL update_product($1,$2,$3,$4);`;

    return { err, rowCount } = await exec(query, [id, newProduct.name, newProduct.price, newProduct.description]);
}

async function remove(id = 0) {

    const query = `CALL delete_product($1)`;

    return { err, rowCount } = await exec(query, [id]); 

}

module.exports = {
    insert,
    search,
    getById,
    update,
    remove
};