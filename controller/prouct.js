const productMdl = require('../model/product');

const Validator = require('../lib/validator');

const { productName, productDescription } = require('../lib/regexps');

async function create(req, res) {

    const validator = new Validator(req.body);

    validator
        .match('name', '', productName)
        .match('description', '', productDescription)
        .match('price', 0);
    
    if (!validator.isOk()) return res.sendStatus(400); // Bad Request

    const newProduct = validator.getValidObj();

    const { err, rowCount } = await productMdl.insert(newProduct);

    if (err != null) {
        console.log('[ERROR] err:', err);

        return res.sendStatus(500); // Internal Server Error
    }

    if (rowCount == 0) return res.sendStatus(404); // Not found

    res.sendStatus(201); // Created
}

async function getById(req, res) {
    const id = Number(req.params.id);

    const { err, rows } = await productMdl.getById(id);

    const rowsLen = rows.length;

    if (err != null) {
        console.log('[ERROR] err:', err);

        return res.sendStatus(500); // Internal Server Error
    }

    if (rowsLen == 0) return res.sendStatus(404); // Not found

    res
        .status(200) // Ok
        .json(rows[0]); // product
}

async function update(req, res) {

    const id = Number(req.params.id);

    const validator = new Validator(req.body);

    validator
        .optionalMatch('name', '', productName)
        .optionalMatch('description', '', productDescription)
        .optionalMatch('price', 0);
    
    if (!validator.isOk()) return res.sendStatus(400); // Bad Request

    const newProduct = validator.getValidObj();

    const { err, rowCount } = await productMdl.update(id, newProduct);

    if (err != null) {
        console.log('[ERROR] err:', err);

        return res.sendStatus(500); // Internal Server Error
    }

    if (rowCount == 0) return res.sendStatus(404); // Not found

    res.sendStatus(200); // Ok
}

async function remove(req, res) {
    const id = Number(req.params.id);

    const { err, rowCount } = await productMdl.remove(id);

    if (err != null) {
        console.log('[ERROR] err:', err);

        return res.sendStatus(500); // Internal Server Error
    }

    if (rowCount == 0) return res.sendStatus(404); // Not found

    res.sendStatus(200); // Ok
}

module.exports = {
    create,
    getById,
    update,
    remove
};