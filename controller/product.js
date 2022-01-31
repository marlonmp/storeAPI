const productMdl = require('../model/product');

async function create(req, res) {

    const { newProduct } = req.checkedBody;

    const { err, rowCount } = await productMdl.insert(newProduct);

    if (err) {
        console.log('[ERROR] err:', err);

        return res.sendStatus(500); // Internal Server Error
    }

    if (rowCount == 0) return res.sendStatus(409); // Conflict

    res.sendStatus(201); // Created
}

async function searchProduct(req, res) {

    const { queries } = req.checkedBody;

    const { err, rows } = await productMdl.search(queries);
    
    if (err) {
        console.log('[ERROR] err:', err);
        
        return res.sendStatus(500); // Internal Server Error
    }

    const rowsLen = rows.length;
    
    if (rowsLen == 0) return res.sendStatus(404); // Not found

    res
        .status(200) // Ok
        .json(rows); // products
}

async function getById(req, res) {
    const { id } = req.checkedBody;

    const { err, rows } = await productMdl.getById(id);

    if (err) {
        console.log('[ERROR] err:', err);
        
        return res.sendStatus(500); // Internal Server Error
    }

    const rowsLen = rows.length;
    
    if (rowsLen == 0) return res.sendStatus(404); // Not found

    res
        .status(200) // Ok
        .json(rows[0]); // product
}

async function update(req, res) {

    const { id, newProduct } = req.checkedBody;

    const { err, rowCount } = await productMdl.update(id, newProduct);

    if (err) {
        console.log('[ERROR] err:', err);

        return res.sendStatus(500); // Internal Server Error
    }

    if (rowCount == 0) return res.sendStatus(404); // Not found

    res.sendStatus(200); // Ok
}

async function remove(req, res) {
    const { id } = req.checkedBody;

    const { err, rowCount } = await productMdl.remove(id);

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