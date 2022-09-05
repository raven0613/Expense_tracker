const express = require('express');

const getFormattedDate = require('../../public/scripts/function');
const router = express.Router();
const Record = require('../../models/record');
let {categoryList} = require('../../public/scripts/categoryData');


router.get('/' , (req , res) => {
  const userId = req.user.id;
  let totalAmount = 0;
  require('../../public/scripts/categoryData').currentCategory = 0;

  //把select清空
  categoryList.forEach(category => {
    category.selected = '';
  })

  Record.find({ userId })
        .lean()
        .then(records => {
          let newRecordsArr = []
          records.forEach(record => {
            const iconObj = { 'icon' : categoryList[record.categoryId - 1].icon }
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
          return res.render('index' , { records : newRecordsArr , totalAmount , category : categoryList })
        })
        .catch(err => console.log(err))
})

module.exports = router;