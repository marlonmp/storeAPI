const productMdl = require('../model/product');

async function create(req, res) {

    const { err, rowCount } = await productMdl.insert(req.checkedBody.product);

    if (err) {
        console.log('[ERROR] err:', err);

        return res.sendStatus(500); // Internal Server Error
    }

    if (rowCount == 0) return res.sendStatus(409); // Conflict

    res.sendStatus(201); // Created
}

async function searchProduct(req, res) {

    const { err, rows } = await productMdl.search(req.checkedQuery);
    
    if (err) {
        console.log('[ERROR] err:', err);
        
        return res.sendStatus(500); // Internal Server Error
    }
    
    if (rows.length == 0) return res.sendStatus(404); // Not found

    res
        .status(200) // Ok
        .json(rows); // products
}

async function getById(req, res) {

    const { err, rows } = await productMdl.getById(req.checkedParams.id);

    if (err) {
        console.log('[ERROR] err:', err);
        
        return res.sendStatus(500); // Internal Server Error
    }
    
    if (rows.length == 0) return res.sendStatus(404); // Not found

    res
        .status(200) // Ok
        .json(rows[0]); // product
}

async function update(req, res) {

    const { id, product } = req.checkedBody;

    const { err, rowCount } = await productMdl.update(id, product);

    if (err) {
        console.log('[ERROR] err:', err);

        return res.sendStatus(500); // Internal Server Error
    }

    if (rowCount == 0) return res.sendStatus(404); // Not found

    res.sendStatus(200); // Ok
}

async function remove(req, res) {

    const { err, rowCount } = await productMdl.remove(req.checkedParams.id);

    if (err) {
        console.log('[ERROR] err:', err);

        return res.sendStatus(500); // Internal Server Error
    }

    if (rowCount == 0) return res.sendStatus(404); // Not found

    res.sendStatus(200); // Ok
}

module.exports = {
    create,
    getById,
    searchProduct,
    update,
    remove
};