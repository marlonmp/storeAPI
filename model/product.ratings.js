const { exec } = require('../db/queries');

/** @param { ProductRating } productRating */
async function add(productId = 0, productRating) {

    const query = `CALL add_rating($1,$2,$3,$4);`;

    return { err, rowCount } = await exec(query, [productId, productRating.owner, productRating.rating, productRating.comment]);
}

async function getRatings(productId = 0) {

    const query = `CALL get_rating($1);`;

    return { err, rows } = await exec(query, [productId]);
}
async function remove(productId = 0, productRatingId = 0) {

    const query = `CALL delete_rating($1,$2);`;

    return { err, rowCount } = await exec(query, [productId, productRatingId]);
}

module.exports = {
    add,
    getRatings,
    remove
};