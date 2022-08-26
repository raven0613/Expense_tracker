const passport = require('passport');
const User = require('../models/user');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());


  passport.use(new localStrategy({ usernameField : 'email' , passReqToCallback : true } , (req , email , password , done) => {
    User.findOne({ email })
    .then(user => {
      if (!user) {
        console.log('email或密碼不正確1')
        return done(null , false)
      }

      return bcrypt.compare(password , user.password)
      .then(isMatched => {
        if (!isMatched) {
          console.log('email或密碼不正確2')
          return done(null , false)
        }
        if (isMatched) {
          console.log('登入成功')
          return done(null , user)
        }
      })
      .catch(err => done(err , false))
    })
    .catch(err => done(err , false))
  }))


  passport.serializeUser((user , done) => {
    return done(null , user._id)
  })
  passport.deserializeUser((id , done) => {
    User.findOne({ _id : id })
    .then(user => done(null , user))
    .catch(err => console.log(err))
  })
}
