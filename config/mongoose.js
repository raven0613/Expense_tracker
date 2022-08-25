const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI_EXPENSE , { useUnifiedTopology: true , useNewUrlParser: true });

const db = mongoose.connection;

db.once('open' , () => {
  console.log('mongoDB connected')
})

db.on('error' , err => {
  console.log(err);
})

module.exports = db;