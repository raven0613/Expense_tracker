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
    return  `<div class="alert alert-danger alert-dismissible fade show" role="alert">
    <p>${warning}</p> 
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`
  }
  
  //確認密碼
  if (confirmedPassword !== password) {
    password_warning = getWarning('密碼與確認密碼不符');
  }

  
  User.findOne({ email })
    .then(user => {
      if (!user){
        return bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(password , salt))
          .then(hash => {
            //確認user資料庫內的id最大值
            return User.find().sort({id:-1}).limit(1)
            .then(user => {
              //user回傳的是陣列
              if (!user.length) {
                //id:1 永遠留給廣志
                return User.create({ id : 2 , name , email , password : hash })
              }
              return User.create({ id : user[0].id + 1 , name , email , password : hash })
            })
            .catch(err => console.log(err))
          })
          .then(() => res.redirect('/'))
          .catch(err => console.log(err))
      }
      email_warning = getWarning('此email已存在');
      return res.render('register' , { name , email , email_warning , password_warning})
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