const validator = require('../lib/validator');
const { Optional, searchQuery, decimal, productName, productDescription } = require('../lib/validations');


function createProduct(req, res, next) {

    const { name, description, price } = req.body;

    const isValid = validator.check(
        { value: name, fn: productName },
        { value: description, fn: productDescription },
        { value: price, fn: decimal }
    );
    
    if (!isValid) return res.sendStatus(400); // Bad Request

    req.checkedBody.newProduct = { name, description, price };

    next();
}

function searchProduct(req, res, next) {

    const { search, minPrice, maxPrice } = req.body;

    const isValid = validator.check(
        { value: search, fn: Optional(searchQuery) },
        { value: minPrice, fn: Optional(decimal) },
        { value: maxPrice, fn: Optional(decimal) }
    );

    if (!isValid || !(search || minPrice || maxPrice)) return res.sendStatus(400); // Bad Request

    req.checkedBody.queries = { search, minPrice, maxPrice };

    next();
}

function paramId(req, res, next) {

    const id = Number(req.params.id);

    if (isNaN(id)) return res.sendStatus(400); // Bad Request

    req.checkedBody.id = id;

    next();
}

function updateProduct(req, res, next) {
        
    const { name, description, price } = req.body;

    const isValid = validator.check(
        { value: name, fn: Optional(productName) },
        { value: description, fn: Optional(productDescription) },
        { value: price, fn: Optional(decimal) }
    );
    
    if (!isValid || !(name || description || price)) return res.sendStatus(400); // Bad Request

    req.checkedBody.newProduct = { name, description, price };

    next();
}

module.exports = {
    createProduct,
    searchProduct,
    paramId,
    updateProduct
};