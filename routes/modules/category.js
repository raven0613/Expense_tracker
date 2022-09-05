const express = require('express')

const Record = require('../../models/record');
const getFormattedDate = require('../../public/scripts/function');
const router = express.Router();
let {categoryList} = require('../../public/scripts/categoryData');

router.get('/:id' , (req , res) => {
  const userId = req.user.id;
  const categoryId = req.params.id;
  require('../../public/scripts/categoryData').currentCategory = categoryId;

  //把select清空再指定
  categoryList.forEach(category => {
    category.selected = '';
  })
  categoryList[categoryId - 1].selected = 'selected';
  
  let totalAmount = 0;

  return Record
  .find({ userId , categoryId })
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