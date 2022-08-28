const express = require('express');
const passport = require('passport')

const router = express.Router();
const Record = require('../../models/record');
const Category = require('../../models/category');
const categoryIcon = require('../../public/scripts/categoryIcon');




router.get('/' , (req , res) => {
  const userId = req.user.id;
  let totalAmount = 0;

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

            totalAmount += record.amount;
          })
          return newRecordsArr;
        })
        .then(newRecordsArr => {
          return res.render('index' , { records : newRecordsArr , totalAmount })
        })
        .catch(err => console.log(err))
})

//get category

module.exports = router;