const express = require('express')

const Category = require('../../models/category');
const Record = require('../../models/record');
const getFormattedDate = require('../../public/scripts/function');
const router = express.Router();
let { categoryIcon } = require('../../public/scripts/categoryData');


//put /records/id
router.put('/:id' , (req , res) => {
  const _id = req.params.id;
  const userId = req.user.id;
  const {name , date , category , amount} = req.body;

  return Record.findOne({ userId , _id })
        .then(records => {
          records.name = name;
          records.date = date;
          records.categoryId = category;
          records.amount = amount;
          return records.save();
        })
        .then(() => {
          let {currentCategory} = require('../../public/scripts/categoryData');

          if (currentCategory > 0) {
            return res.redirect(`/category/${currentCategory}`)
          }
          return res.redirect('/')
        })
        .catch(err => console.log(err))

})

//get /records/new
router.get('/new' , (req , res) => {
  return Category.find()
    .lean()
    .sort({ id : 'asc' })
    .then(categories => categories.map(category => {
      return {...category , 'select' : '' , 'icon' : categoryIcon[category.id - 1] || ''}
    }))
    .then(categoryData => res.render('new' , { today : getFormattedDate() , category : categoryData }))
    .catch(err => console.log(err))
})

//post /records
router.post('/' , (req , res) => {
  const {name , date , category , amount} = req.body;
  const userId = req.user.id;

  Record.find().sort({id:-1}).limit(1)
  .then(record => {
    if(record.length)
      return Record.create({
      id : record[0].id + 1 , name , date , amount , userId , categoryId : category
    })
    return Record.create({
      id : 1 , name , date , amount , userId , categoryId : category
    })
  })
  .then(() => res.redirect('/'))
  .catch(err => console.log(err))
})

//get /records/id/edit
router.get('/:id/edit' , (req , res) => {
  const _id = req.params.id;
  const userId = req.user.id;

  return Promise.all([
    Record.findOne({ userId , _id }).lean(),
    Category.find().lean().sort({ id : 'asc' })
  ]) 
  .then(([records , categories]) => {
    let categoryList = categories.map(category => {
      return {...category , 'select' : '' , 'icon' : categoryIcon[category.id - 1] || ''}
    })
    categoryList[records.categoryId - 1].selected = 'selected';
    return res.render('edit' , { records , date : getFormattedDate (records.date) , category : categoryList })
  })
  .catch(err => console.log(err))

})

//delete /records/id
router.delete('/:id' , (req , res) => {
  const _id = req.params.id;
  const userId = req.user.id;

  return Record.findOne({ userId , _id })
        .then(records => {
          return records.delete();
        })
        .then(() => {
          let {currentCategory} = require('../../public/scripts/categoryData');

          if (currentCategory > 0) {
            return res.redirect(`/category/${currentCategory}`)
          }
          return res.redirect('/')
        })
        .catch(err => console.log(err))
})


module.exports = router;