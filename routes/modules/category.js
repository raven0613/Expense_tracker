const express = require('express')

const Record = require('../../models/record');
const Category = require('../../models/category');
const getFormattedDate = require('../../public/scripts/function');
const router = express.Router();
let { categoryIcon } = require('../../public/scripts/categoryData');


router.get('/:id' , (req , res) => {
  const userId = req.user.id;
  const categoryId = req.params.id;
  require('../../public/scripts/categoryData').currentCategory = categoryId;
  
  let totalAmount = 0;

  return Promise.all([
    Record.find({ userId , categoryId }).lean(),
    Category.find().lean().sort({ id : 'asc' })
  ]) 
  .then(([records , categories]) => {
    
    let categoryList = categories.map(category => {
      return {...category , 'select' : '' , 'icon' : categoryIcon[category.id - 1] || ''}
    })
    categoryList[categoryId - 1].selected = 'selected';
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