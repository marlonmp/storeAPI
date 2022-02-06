const validator = require('../lib/validator');
const { Optional, searchQuery, decimal, productName, productDescription, userName, userEmail, userPassword } = require('../lib/validations');


function createProduct(req, res, next) {

    const { name, description, price } = req.body;

    const isValid = validator.check(
        { value: name, fn: productName },
        { value: description, fn: productDescription },
        { value: price, fn: decimal }
    );
    
    if (!isValid) return res.sendStatus(400); // Bad Request

    req.checkedBody.product = { name, description, price };

    next();
}

function searchProduct(req, res, next) {

    const { query, minPrice, maxPrice } = req.query;

    const isValid = validator.check(
        { value: query, fn: Optional(searchQuery) },
        { value: minPrice, fn: Optional(decimal) },
        { value: maxPrice, fn: Optional(decimal) }
    );

    if (!isValid || !(query || minPrice || maxPrice)) return res.sendStatus(400); // Bad Request

    req.checkedQuery = { query, minPrice, maxPrice };

    next();
}

function paramId(req, res, next) {

    const id = Number(req.params.id);

    if (isNaN(id)) return res.sendStatus(400); // Bad Request

    req.checkedParams.id = id;

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

    req.checkedBody.product = { name, description, price };

    next();
}

function signUp(req, res, next) {

    const { first_name, last_name, email, password } = req.body;

    const isValid = validator.check(
        { value: first_name, fn: userName },
        { value: last_name, fn: userName },
        { value: email, fn: userEmail },
        { value: password, fn: userPassword }
    );

    if (!isValid) return res.sendStatus(400); // Bad Request

    req.checkedBody.user = { first_name, last_name, email, password };

    next();
}

function signIn(req, res, next) {

    const { email, password } = req.body;

    const isValid = validator.check(
        { value: email, fn: userEmail },
        { value: password, fn: userPassword }
    );

    if (!isValid) return res.sendStatus(400); // Bad Request

    req.checkedBody.user = { email, password };

    next();
}

function updateUser(req, res, next) {

    const { first_name, last_name, email, password } = req.body;

    const isValid = validator.check(
        { value: first_name, fn: Optional(userName) },
        { value: last_name, fn: Optional(userName) },
        { value: email, fn: Optional(userEmail) },
        { value: password, fn: Optional(userPassword) }
    );

    if (!isValid || !(first_name, last_name, email, password)) return res.sendStatus(400); // Bad Request

    req.checkedBody.user = { first_name, last_name, email, password };

    next();
}

module.exports = {
    createProduct,
    searchProduct,
    paramId,
    updateProduct,
    signUp,
    signIn,
    updateUser
};