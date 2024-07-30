const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const indexRouter = require("./routes/index");
const ownersRouter = require('./routes/ownersRouter');
const productsRouter = require('./routes/productsRouter');
const usersRouter = require('./routes/usersRouter');
const session = require("express-session");
const flash = require("connect-flash");

require("dotenv").config();

// Import Mongoose connection
const db = require('./config/mongoose-connection');

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret', // Environment variable ka use karein
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Local development ke liye secure false rakh sakte hain
}));


app.use(flash());
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

// Define routes
app.use("/", indexRouter);
app.use('/owners', ownersRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);


app.listen(3000);