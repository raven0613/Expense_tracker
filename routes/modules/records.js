const express = require('express')
const router = express.Router();
const Record = require('../../models/record');
const User = require('../../models/user');


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

//put /records/id

//delete /records/id


module.exports = router;