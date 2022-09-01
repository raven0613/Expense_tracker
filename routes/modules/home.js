const express = require('express');

const getFormattedDate = require('../../public/scripts/function');
const router = express.Router();
const Record = require('../../models/record');
const categoryIcon = require('../../public/scripts/categoryIcon');


router.get('/' , (req , res) => {
  const userId = req.user.id;
  let totalAmount = 0;
  global.currentCategory = 0;

  Record.find({ userId })
        .lean()
        .then(records => {
          let newRecordsArr = []
          records.forEach(record => {
            const iconObj = { 'icon' : Object.values(categoryIcon[record.categoryId-1])[0] }
            //合併record與icon物件
            const newAppendObj = { ...record , ...iconObj }
            newRecordsArr.push(newAppendObj)

            totalAmount += record.amount;
          })
          return newRecordsArr;
        })
        .then(newRecordsArr => {
          newRecordsArr.forEach(record => {
            record.date = getFormattedDate(record.date)
          })
          return res.render('index' , { records : newRecordsArr , totalAmount })
        })
        .catch(err => console.log(err))
})

module.exports = router;