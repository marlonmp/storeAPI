const express = require('express');
const router = express.Router();

router.use('/account', require('./account'));

router.use('/product', require('./product'));

module.exports = router;