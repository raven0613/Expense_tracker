const db = require('../../config/mongoose');
const bcrypt = require('bcryptjs');
const User = require('../user')
const Record = require('../record');


const seedRecords = [
  { 'name' : '午餐' , 'amount': 60 , 'categoryId' : 4 },
  { 'name' : '晚餐' , 'amount': 60 , 'categoryId' : 4 },
  { 'name' : '捷運' , 'amount': 120 , 'categoryId' : 2 },
  { 'name' : '電影：驚奇隊長' , 'amount': 220 , 'categoryId' : 3 },
  { 'name' : '租金' , 'amount': 25000 , 'categoryId' : 1 }
]

const seedUser = {
  id: 1,
  name: '廣志',
  email: 'user1@example.com',
  password: '12345678'
}

function createRecord (data , user , recordQuantity){
  return Promise.all(Array.from(
    { length: data.length } , (_value , i) => {
      return Record.create({
        id: recordQuantity + i + 1,
        name: data[i].name,
        amount: data[i].amount,
        userId: user.id,
        categoryId: data[i].categoryId
      })
    }
  ))
}


db.once('open' , () => {

  User
  .findOne({ email : seedUser.email })
  .then(user => {
    //如果user不存在就創一個user再創花費
    if (!user){
      return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(seedUser.password , salt))
      .then(hash => User.create({
        id: seedUser.id,
        name: seedUser.name,
        email: seedUser.email,
        password: hash,
      }))
      .then(user => {
        return Record
        .find().sort({id:-1}).limit(1)
        .then(record => {
          if (record.length) {
            return createRecord (seedRecords , user , record[0].id)
          }
          return createRecord (seedRecords , user , 0)
        })
        .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
    }
    //如果user存在就直接創花費
    if (user) {
      
      return Record
      .find().sort({id:-1}).limit(1)
      .then(record => {
        if (record.length) {
          return createRecord (seedRecords , user , record[0].id)
        }
        return createRecord (seedRecords , user , 0)
      })
      .catch(err => console.log(err))
    }
  })
  .then(() => {
    console.log('recordSeed done');
    process.exit();
  })
  .catch(err => console.log(err))


})