if (process.env.NODE_ENV !== 'profuction') {
  require('dotenv').config();
}

const passport = require('passport');
const User = require('../models/user');
const localStrategy = require('passport-local').Strategy;
const facebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const bcrypt = require('bcryptjs');

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  //帳密登入
  passport.use(new localStrategy({ usernameField : 'email' , passReqToCallback : true } , (req , email , password , done) => {
    User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('warning_msg' , 'email 或 密碼不正確');
        return done(null , false)
      }

      return bcrypt.compare(password , user.password)
      .then(isMatched => {
        if (!isMatched) {
          req.flash('warning_msg' , 'email 或 密碼不正確');
          return done(null , false)
        }
        if (isMatched) {
          req.flash('success_msg' , '登入成功');
          return done(null , user)
        }
      })
      .catch(err => done(err , false))
    })
    .catch(err => done(err , false))
  }))
  //facebook登入
  passport.use(new facebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email' , 'displayName'],
    passReqToCallback : true
  } , (req , accessToken, refreshToken, profile, done) => {
    const {name , email} = profile._json;
    const randomPassword = Math.random().toString(36).slice(-8)

    User.find()
    .then(user => {
      const userCount = user.length;
      return userCount;
    })
    .then(userCount => {

      User.findOne({ email })
      .then(user => {
        if (!user) {
          return bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(randomPassword , salt))
          .then(hash => {
            return User.create({ id : userCount + 1 , name , email , password : hash })
          })
          .then(user => {
            req.flash('success_msg' , '登入成功');
            done(null , user)
          })
          .catch(err => done(err , false))
        }
        req.flash('success_msg' , '登入成功');
        return done(null , user)
      })
      .catch(err => done(err , false))
    })
  }))

  //google登入
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_CALLBACK,
    scope: ['email' , 'profile' ],
    state: true,
    passReqToCallback : true
  } , (req , accessToken, refreshToken, profile, done) => {

    const {name , email} = profile._json;
    const randomPassword = Math.random().toString(36).slice(-8)

    User.find()
    .then(user => {
      const userCount = user.length;
      return userCount;
    })
    .then(userCount => {

      User.findOne({ email })
      .then(user => {
        if (!user) {
          return bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(randomPassword , salt))
          .then(hash => {
            return User.create({ id : userCount + 1 , name , email , password : hash })
          })
          .then(user => {
            req.flash('success_msg' , '登入成功');
            done(null , user)})
          .catch(err => done(err , false))
        }
        req.flash('success_msg' , '登入成功');
        return done(null , user)
      })
      .catch(err => done(err , false))
    })
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
