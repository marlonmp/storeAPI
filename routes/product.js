const express = require('express');
const router = express.Router();

const productCtl = require('../controller/product');

const auth = require('../middleware/auth');
const validate = require('../middleware/validations');

router.get('/', auth.verifyToken, validate.createProduct, productCtl.searchProduct);

router.get('/:id', auth.verifyToken, validate.paramId, productCtl.getById);

router.post('/', auth.verifyToken, auth.verifyIfIsOwner, validate.createProduct, productCtl.create);

router.put('/:id', auth.verifyToken, auth.verifyIfIsOwner, validate.updateProduct, productCtl.update);

router.delete('/:id', auth.verifyToken, auth.verifyIfIsOwner, validate.paramId, productCtl.remove);

module.exports = router;