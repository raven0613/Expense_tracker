const express = require('express');
const passport = require('passport')

const router = express.Router();
const Record = require('../../models/record');
const Category = require('../../models/category');
const categoryIcon = require('../../public/scripts/categoryIcon');


router.get('/auth/facebook', passport.authenticate('facebook'));

//get /users/login/facebook
router.get('/auth/facebook/callback' , passport.authenticate('facebook' , { 
  failureRedirect : '/users/login', 
  successRedirect : '/'
} , { scope: ['email', 'public_profile'] }))


router.get('/' , (req , res) => {
  const userId = 1;

  Record.find({ userId })
        .lean()
        .then(records => {
          // const categoryId = Object.values(records[0])[5];
          let newRecordsArr = []
          records.forEach(record => {
            const iconObj = { 'icon' : Object.values(categoryIcon[record.categoryId-1])[0] }
            //合併兩個物件
            const newAppendObj = { ...record , ...iconObj }
            newRecordsArr.push(newAppendObj)
          })
          return newRecordsArr;
        })
        .then(newRecordsArr => {
          return res.render('index' , { records : newRecordsArr })
        })
        .catch(err => console.log(err))
})

//get category

module.exports = router;