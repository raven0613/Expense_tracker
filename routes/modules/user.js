const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../../models/user');




//get /users/login
router.get('/login' , (req , res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('login')
})

//get /users/register
router.get('/register' , (req , res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('register')
})

//post /users/register
router.post('/register' , (req , res) => {
  const {name , email , password , confirmedPassword} = req.body
  let password_warning = '';
  let email_warning = '';

  function getWarning (warning) {
    return  `<div class="alert alert-dismissible fade show" role="alert">
    <p>${warning}</p> 
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`
  }
  
  //確認密碼
  if (confirmedPassword !== password) {
    password_warning = getWarning('密碼與確認密碼不符');
  }

  //確認資料庫內的user數量
  User.find()
    .then(user => {
      const userCount = user.length;
      return userCount;
    })
    .then(userCount => {
      
      User.findOne({ email })
        .then(user => {
          if (!user){
            return bcrypt.genSalt(10)
              .then(salt => bcrypt.hash(password , salt))
              .then(hash => {
                return User.create({ id : userCount + 1 , name , email , password : hash })
              })
              .then(() => res.redirect('/'))
              .catch(err => console.log(err))
          }
          email_warning = getWarning('此email已存在');
          return res.render('register' , { name , email , email_warning , password_warning})
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))


})


//post /users/login
router.post('/login' , passport.authenticate('local' , { 
  failureRedirect : '/users/login', 
  successRedirect : '/'
}))



//get /users/logout
router.get('/logout' , (req , res) => {
  req.logout();
  res.redirect('/users/login');
})


module.exports = router;