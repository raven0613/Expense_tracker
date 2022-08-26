const express = require('express')

const Record = require('../../models/record');
const User = require('../../models/user');
const router = express.Router();



//put /records/id
router.put('/:id' , (req , res) => {
  const _id = req.params.id;
  const userId = 1;
  const {name , date , category , amount} = req.body;

  return Record.findOne({ userId , _id })
        .then(records => {
          records.name = name;
          records.date = date;
          records.categoryId = category;
          records.amount = amount;
          return records.save();
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))

})

//get /records/new
router.get('/new' , (req , res) => {
  res.render('new')
})

//post /records
router.post('/' , (req , res) => {
  const {name , date , category , amount} = req.body;

  Record.find()
  .then(record => {
    return record.length;
  })
  .then(quantity => {
    return Record.create({
      id : quantity + 1 , name , date , amount , userId : 1 , categoryId : category
    })
  })
  .then(() => res.redirect('/'))
  .catch(err => console.log(err))

})

//get /records/id/edit
router.get('/:id/edit' , (req , res) => {
  const _id = req.params.id;
  const userId = 1;
  //誰selected?
  return Record.findOne({ userId , _id })
        .lean()
        .then(records => {
          return res.render('edit' , { records })
        })
        .catch(err => console.log(err))
})



//delete /records/id
router.delete('/:id' , (req , res) => {
  const _id = req.params.id;
  const userId = 1;

  return Record.findOne({ userId , _id })
        .then(records => {
          return records.delete();
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
})


module.exports = router;