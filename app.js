const express = require('express');
const session = require('express-session');
const usePassport = require('./config/passport');

if (process.env.NODE_ENV !== 'profuction') {
  require('dotenv').config();
}

const app = express();
const exphdb = require('express-handlebars');
const methodOverride = require('method-override');
const PORT = process.env.PORT;
const routes = require('./routes');
require('./config/mongoose');


app.engine('handlebars' , exphdb.engine({ defaultLayout : 'main' }));
app.set('view engine' , 'handlebars');


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
usePassport(app);

app.use(express.urlencoded({ extended : true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(routes);



app.listen(PORT , (req , res) => {
  console.log(`Server is running on http://localhost:${PORT}`)
})