const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/redirect/google',
  passport.authenticate('google', { 
    failureRedirect: '/login', 
    successRedirect: '/'
  }));


module.exports = router;