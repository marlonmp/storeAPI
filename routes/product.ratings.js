const express = require('express');
const router = express.Router();

const productRatingsCtl = require('../controller/product.ratings');

const auth = require('../middleware/auth');
const validate = require('../middleware/validations');

router.get('/', auth.verifyToken, productRatingsCtl.getRatings);

router.post('/', auth.verifyToken, validate.createRating, productRatingsCtl.add);

router.delete('/:ratingId', auth.verifyToken, validate.paramId('ratingId'), productRatingsCtl.remove);

module.exports = router;