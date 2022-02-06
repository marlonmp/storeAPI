const express = require('express');
const router = express.Router();

const accountCtl = require('../controller/account');

const auth = require('../middleware/auth');
const validate = require('../middleware/validations');
const hashPassword = require('../middleware/hashPassword');

router.post('/signUp', validate.signUp, hashPassword.hash, accountCtl.signUp);

router.post('/signIn',  validate.signIn, accountCtl.signIn);

router.get('/', auth.verifyToken, validate.paramId, accountCtl.getAccount);

router.put('/', auth.verifyToken, validate.paramId, validate.updateUser, hashPassword.hash, accountCtl.update);

router.delete('/', auth.verifyToken, validate.paramId, accountCtl.remove);

module.exports = router;