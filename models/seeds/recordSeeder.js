const db = require('../../config/mongoose');

db.once('open' , () => {
  console.log('rec')
})