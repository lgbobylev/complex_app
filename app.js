const express = require('express');
const app = express();
const router = require('./router');

const session = require('express-session');
const MongoStore = require('connect-mongo') (session);
const flash = require('connect-flash');

const sessionOptions = session({
    secret: 'JavaScript is the best', 
    store: new MongoStore({client: require('./db')}), 
    resave: false, 
    saveUninitialized: true,
    cookie: {
        maxAge: 1000*60*60*24, 
        httpOnly: true
    }
});

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(sessionOptions);
app.use(express.static('public'));
app.use(flash());
app.use(function(req, res, next){
    res.locals.user = req.session.user;
    next();
});
// configure express app to use ejs html template 
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use('/', router);

module.exports = app;
