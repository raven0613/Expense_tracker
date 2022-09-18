const express = require('express');

const getFormattedDate = require('../../public/scripts/function');
const router = express.Router();
const Record = require('../../models/record');
const Category = require('../../models/category');
let { categoryIcon } = require('../../public/scripts/categoryData');


router.get('/' , (req , res) => {
  const userId = req.user.id;
  let totalAmount = 0;
  require('../../public/scripts/categoryData').currentCategory = 0;

  return Promise.all([
    Record.find({ userId }).lean(),
    Category.find().lean().sort({ id : 'asc' })
  ]) 
  .then(([records , categories]) => {
    
    let categoryList = categories.map(category => {
      return {...category , 'select' : '' , 'icon' : categoryIcon[category.id - 1] || ''}
    })
    records = records.map(record => {
      return {...record , 'icon' : categoryList[record.categoryId - 1].icon , 'date' : getFormattedDate(record.date)}
    })
    records.forEach(record => {
      totalAmount += record.amount;
    })
    return res.render('index' , { records , totalAmount , category : categoryList })
  })
  .catch(err => console.log(err))
})

module.exports = router;