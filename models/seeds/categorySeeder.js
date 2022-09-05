const db = require('../../config/mongoose');
const Category = require('../category');
require('dotenv').config();
const {categoryList} = require('../../public/scripts/categoryData');


db.once('open' , () => {

  return Promise.all(Array.from({ length: 5 } , (_value , i) => 
    Category
    .findOne({ id : i+1 })
    .then(category => {
      if (!category) {
        return Category.create({
          id: i+1,
          name: categoryList[i].name
        })
      }
    })
    .catch(err => console.log(err))
  ))
  .then(() => {
    console.log('categorySeed done')
    process.exit();
  })
  .catch(err => console.log(err))
})