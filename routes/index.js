const express = require('express');
require('passport');
const router = express.Router();
const home = require('./modules/home')
const records = require('./modules/records')
const user = require('./modules/user');
const authenticator = require('../middleware/auth');

router.use('/records' , authenticator , records);
router.use('/users' , user);
router.use('/' , home);




module.exports = router;