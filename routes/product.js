const express = require('express');
const router = express.Router();

const productCtl = require('../controller/prouct');

router.post('/', productCtl.create);

router.put('/:id', productCtl.update);

router.delete('/:id', productCtl.remove);

module.exports = router;