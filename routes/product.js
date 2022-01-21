const express = require('express');
const router = express.Router();

const productCtl = require('../controller/prouct');

router.post('/', productCtl.create);

module.exports = router;