const bcrypt = require('bcryptjs');
const usersCollection = require('../db').db().collection('users');
const validator = require('validator');
const md5 = require('md5');

const User = function(form_data){
    this.data = form_data;
    this.errors = [];
}

User.prototype.cleanUp = function() {
    if(typeof this.data.username != 'string') this.data.username = '';
    if(typeof this.data.email != 'string') this.data.email = '';
    if(typeof this.data.password != 'string') this.data.password = '';

    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(), 
        password: this.data.password
    };
}

User.prototype.validate = function () {
    return new Promise(async (resolve, reject) => {
        // Check incoming form data. Does it provide valid values?
        if (this.data.username == '') this.errors.push('You must provide a username');
        else if (!validator.isAlphanumeric(this.data.username)) this.errors.push('The username must contain only alphanumeric characters');
        if (!validator.isEmail(this.data.email)) this.errors.push('You must provide a valid email address')
        if (this.data.password == '') this.errors.push('You must provide a password');
        if (this.data.password.length > 0 && this.data.password.length < 8) this.errors.push('The password must be 8 characters at least');
        if (this.data.password.length > 50) this.errors.push('The password cannot exceed 50 characters');
        if (this.data.username.length > 0 && this.data.username.length < 2) this.errors.push('The username must be 3 characters at least');
        if (this.data.username.length > 20) this.errors.push('The username cannot exceed 20 characters');

        if(!this.errors.length) {
            console.log('Checking username');
            await usersCollection.findOne({username: this.data.username}).then((result)=>{
                if(result) {
                    console.log('Username cheking result ', result);
                    this.errors.push('That username is already taken');
                }
            }).catch((error)=>{
                this.errors.push(error);
            });
            console.log('Checking email');
            await usersCollection.findOne({email: this.data.email}).then((result)=>{
                if(result) {
                    console.log('Email checking result ', result);
                    this.errors.push('That email address is already being used')
                }
            }).catch((error)=>{
                this.errors.push(error)
            });
        }
        if(this.errors.length) {
            console.log('From validation reject', this.errors);
            reject(this.errors);
        } else {
            console.log('From validation resolve',this.errors);
            resolve('Validation completed without errors');
        }
    });
}

User.prototype.login = function(callback) {
    return new Promise((resolve, reject)=>{
        this.cleanUp();
        usersCollection.findOne({username: this.data.username})
        .then((attemptedUser)=>{
            if(attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
                this.data = attemptedUser;
                this.getAvatar();
                resolve(`The user '${this.data.username}' is logged in`);
            } else {
                reject('Invalid username / password');
            }
        })
        .catch((err) => reject('Try again later!'));
    });
}

User.prototype.register = function(){
    return new Promise(async (resolve, reject) => {
        this.cleanUp();
        // Step 1: Validate user data
        try {
            await this.validate();
            // Step 2: Only if there are no validation errors then
            // save user data into a database
            if(!this.errors.length){
                // hash user's password
                const salt = bcrypt.genSaltSync(10);
                this.data.password = bcrypt.hashSync(this.data.password, salt); 
                await usersCollection.insertOne(this.data);
                this.getAvatar();
                resolve('New user registered');
            } else {
                reject(this.errors);
            }
        } catch (error) {
            reject(error);
        }
    });
}

User.prototype.getAvatar = function() {
    this.avatar = `https://gravatar.com/avatar/${this.data.email}?s=128`;
}

module.exports = User;
