const express = require('express')

const Record = require('../../models/record');
const getFormattedDate = require('../../public/scripts/function');
const router = express.Router();
const categoryIcon = require('../../public/scripts/categoryIcon');


router.get('/:id' , (req , res) => {
  const userId = req.user.id;
  const categoryId = req.params.id;
  let totalAmount = 0;
  let { one_selected , two_selected , three_selected , four_selected , five_selected } = '';
  
  if (categoryId === '1') { one_selected = 'selected';}
  if (categoryId === '2') { two_selected = 'selected';}
  if (categoryId === '3') { three_selected = 'selected';}
  if (categoryId === '4') { four_selected = 'selected';}
  if (categoryId === '5') { five_selected = 'selected';}

  return Record
  .find({ userId , categoryId })
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
    return res.render('index' , { records : newRecordsArr , totalAmount , one_selected , two_selected , three_selected , four_selected , five_selected })
  })
  .catch(err => console.log(err))
    
  
})

module.exports = router;