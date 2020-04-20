let User = require('../models/User');

exports.login = function(req, res){
    let user = new User(req.body);
    user.login()
        .then((result)=>{
            req.session.user = {username: user.data.username, avatar: user.avatar, _id: user.data._id};
            req.session.save(function(){
            res.redirect('/');
            console.log(result);
            });
        })
        .catch((err)=>{
            req.flash('errors', err);
            req.session.save(function(){
                res.redirect('/');
            });
        });
}

exports.logout = function(req, res){
    req.session.destroy(function(){
        res.redirect('/');
    });
}

exports.register = function(req, res){
    let user = new User(req.body);
    user.register()
    .then((result)=>{
        console.log(result);
        req.session.user = {username: user.data.username, avatar: user.avatar, _id: user.data._id};
        req.session.save(function(){
            res.redirect('/');
        });
    })
    .catch((regErrors)=>{
        regErrors.forEach(function(error){
            req.flash('regErrors', error);
            req.session.save(function(){
                res.redirect('/');
            });
        });
    });
}

exports.home = function(req, res){
    if(req.session.user) {
        res.render('home-dashboard');
    } else {
        res.render('home-guest', {errors: req.flash('errors'), regErrors: req.flash('regErrors')});
    }
}

exports.mustBeLoggedIn = function (req, res, next) {
    if(!req.session.user) {
        req.flash('errors', 'You must be logged in to perform this action');
        res.redirect('/');
    } else {
        next();
    }
}