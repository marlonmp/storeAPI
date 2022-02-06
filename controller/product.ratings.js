const productRatingsMdl = require('../model/product.ratings');

async function add(req, res) {

    const { productId } = req.checkedParams;

    const { productRating } = req.checkedBody;

    const { err, rowCount } = productRatingsMdl.add(productId, productRating);

    if (!err) {
        console.log('[ERROR] err:', err);

        return res.sendStatus(500); // Internal server error
    }

    if (rowCount == 0) return res.sendStatus(409); // Conflict

    res.sensStatus(201); // Created
}

async function getRatings(req, res) {

    const { productId } = req.checkedParams;

    const { err, rows } = productRatingsMdl.getRatings(productId);

    if (!err) {
        console.log('[ERROR] err:', err);

        return res.sendStatus(500); // Internal server error
    }

    if (rows.length == 0) return res.sendStatus(404); // Not found

    res
        .status(200) // Ok
        .json(rows);
}

async function remove(req, res) {

    const { productId, ratingsId } = req.checkedParams;

    const { err, rowCount } = productRatingsMdl.remove(productId, ratingsId);

    if (!err) {
        console.log('[ERROR] err:', err);

        return res.sendStatus(500); // Internal server error
    }

    if (rowCount == 0) return res.sendStatus(404); // Not found

    res.sensStatus(200); // Ok
}

module.exports = {
    add,
    getRatings,
    remove
};