const express = require('express');
const session = require('express-session');
const usePassport = require('./config/passport');
const flash = require('connect-flash');

if (process.env.NODE_ENV !== 'profuction') {
  require('dotenv').config();
}

const app = express();
const exphdb = require('express-handlebars');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const methodOverride = require('method-override');
const PORT = process.env.PORT;
const routes = require('./routes');
require('./config/mongoose');


app.engine('handlebars' , exphdb.engine({ defaultLayout : 'main' , handlebars : allowInsecurePrototypeAccess(Handlebars) }));
app.set('view engine' , 'handlebars');

app.use(flash());
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
usePassport(app);

app.use((req , res , next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;

  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next();
})


app.use(express.urlencoded({ extended : true }));
app.use(methodOverride('_method'));

app.use(routes);


app.listen(PORT , (req , res) => {
  console.log(`Server is running on http://localhost:${PORT}`)
})