const express = require('express');
const app = express();
const router = require('./router');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static('public'));
// configure express app to use ejs html template 
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use('/', router);

module.exports = app;
