const express = require('express')

const Record = require('../../models/record');
const getFormattedDate = require('../../public/scripts/function');
const router = express.Router();


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
          if (global.currentCategory > 0) {
            return res.redirect(`/category/${global.currentCategory}`)
          }
          return res.redirect('/')
        })
        .catch(err => console.log(err))

})

//get /records/new
router.get('/new' , (req , res) => {

  res.render('new' , { today : getFormattedDate() })
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
  let { one_selected , two_selected , three_selected , four_selected , five_selected } = '';


  return Record.findOne({ userId , _id })
        .lean()
        .then(records => {
          if (records.categoryId === 1) { one_selected = 'selected';}
          if (records.categoryId === 2) { two_selected = 'selected';}
          if (records.categoryId === 3) { three_selected = 'selected';}
          if (records.categoryId === 4) { four_selected = 'selected';}
          if (records.categoryId === 5) { five_selected = 'selected';}
          return res.render('edit' , { records , date : getFormattedDate (records.date) , one_selected , two_selected , three_selected , four_selected , five_selected })
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
          if (global.currentCategory > 0) {
            return res.redirect(`/category/${global.currentCategory}`)
          }
          return res.redirect('/')
        })
        .catch(err => console.log(err))
})


module.exports = router;