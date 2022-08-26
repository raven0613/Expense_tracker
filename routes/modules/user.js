const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../../models/user');




//get /users/login
router.get('/login' , (req , res) => {
  res.render('login')
})

//get /users/register
router.get('/register' , (req , res) => {
  res.render('register')
})

//post /users/register
router.post('/register' , (req , res) => {
  const {name , email , password , confirmedPassword} = req.body
  
  //如果user是登入狀態那就強制導回首頁

  //確認密碼
  if (confirmedPassword !== password) {
    return console.log('密碼不符')
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

//post /users/login/facebook
router.post('/login/facebook' , passport.authenticate('local' , { 
  failureRedirect : '/users/login', 
  successRedirect : '/'
}))

//get /users/logout
router.get('/logout' , (req , res) => {
  req.logout();
  res.redirect('/users/login');
})


module.exports = router;