const express = require('express')
require('dotenv').config();
const app = express();
const exphdb = require('express-handlebars');
const PORT = process.env.PORT;
const routes = require('./routes');
require('./config/mongoose');


app.engine('handlebars' , exphdb.engine({ defaultLayout : 'main' }));
app.set('view engine' , 'handlebars');


app.use(express.static('public'))
app.use(routes);



app.listen(PORT , (req , res) => {
  console.log(`Server is running on http://localhost:${PORT}`)
})