const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const passport  = require('passport');
const app = express();

//bodyParser middles
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//spliting routes into different files
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

// mongo db client
const db = require('./config/keys').mongoURI;


mongoose.connect(db)
  .then((res) => {
    console.log('database connect');
  })
  .catch((err) => {
    console.log(err);
  })

// Passport middleware
// Using JWT stategy
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);


//express router will handle routes in seperate files
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('listening on the port');
})

// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './components/App';
//
// ReactDOM.render(<App />, document.getElementById('app'));
