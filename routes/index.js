const express = require('express');
const router = express.Router();
const home = require('./modules/home')
const records = require('./modules/records')
const user = require('./modules/user');

router.use('/records' , records);
router.use('/users' , user);
router.use('/' , home);




module.exports = router;