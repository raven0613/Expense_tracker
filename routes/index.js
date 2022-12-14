const express = require('express');
require('passport');
const router = express.Router();
const home = require('./modules/home')
const records = require('./modules/records');
const user = require('./modules/user');
const auth = require('./modules/auth');
const oauth2 = require('./modules/oauth2');
const category = require('./modules/category');
const authenticator = require('../middleware/auth');



router.use('/auth' , auth);
router.use('/oauth2' , oauth2);
router.use('/records' , authenticator , records);
router.use('/users' , user);
router.use('/category' , authenticator , category);
router.use('/' , authenticator , home);



module.exports = router;