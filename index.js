const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();
connectDB();
const authMiddleware = require('./controller/authMiddleware')
const homeRoute = require('./routes/home.route');
const signUpRoute = require('./routes/signup.route');
const logInRoute = require('./routes/login.route');
const ContactRoute = require('./routes/contact.route');

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the directory where templates are located
app.set('views', './views');

// Middleware to serve static files from a directory
app.use(express.static('public'));

// Middleware to parse JSON request 
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// Middleware to parse URL-encoded request 
app.use(express.urlencoded({ extended: true }));

app.use(authMiddleware);
// routes
app.use('/' , homeRoute);
app.use('/', signUpRoute);
app.use('/', logInRoute);
app.use('/', ContactRoute);

// handle 404 errors
app.use((req, res) => {
  res.status(404).render("404" , {
    user: req.user || null
  })
});

const host = '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
}); 