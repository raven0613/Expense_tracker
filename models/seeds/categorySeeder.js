const db = require('../../config/mongoose');
const Category = require('../category');
require('dotenv').config();

const CATEGORY = {
  家居物業: "https://fontawesome.com/icons/home?style=solid",
  交通出行: "https://fontawesome.com/icons/shuttle-van?style=solid",
  休閒娛樂: "https://fontawesome.com/icons/grin-beam?style=solid",
  餐飲食品: "https://fontawesome.com/icons/utensils?style=solid",
  其他: "https://fontawesome.com/icons/pen?style=solid"
}


db.once('open' , () => {

  return Promise.all(Array.from({ length: 5 } , (_value , i) => 
    Category
    .findOne({ id : i+1 })
    .then(category => {
      if (!category) {
        return Category.create({
          id: i+1,
          name: Object.keys(CATEGORY)[i]
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