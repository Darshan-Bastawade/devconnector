const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users =require('./route/api/users');
const profiles =require('./route/api/profiles');
const posts =require('./route/api/posts');


const app = express();

// Body parser middleware

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// DB Config

const db = require ('./config/keys').mongoURI;

// Connect to monogodb

mongoose
    .connect(db)
    .then(() => console.log("Mongodb Connected"))
    .catch(err => console.log(err))

//app.get ('/', function (req,res) { res.send('ss')});
//Passport middleware

app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);
// Use routes

app.use('/api/users' , users);
app.use('/api/posts' , posts);
app.use('/api/profiles' , profiles);



const port = process.env.PORT || 5000;

app.listen(port, function() {console.log(`Server is running on ${port}`)});
