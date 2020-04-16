const bcrypt = require('bcryptjs');
const usersCollection = require('../db').collection('users');
const validator = require('validator');
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

User.prototype.validate = function(){
    // Check incoming form data. Does it provide valid values?
    if(this.data.username == '') this.errors.push('You must provide a username');
    else if (!validator.isAlphanumeric(this.data.username)) this.errors.push('The username must contain only alphanumeric characters');
    if(!validator.isEmail(this.data.email)) this.errors.push('You must provide a valid email address')
    if(this.data.password == '') this.errors.push('You must provide a password');
    if(this.data.password.length > 0 && this.data.password.length < 8) this.errors.push('The password must be 8 characters at least');
    if(this.data.password.length > 50) this.errors.push('The password cannot exceed 50 characters');
    if(this.data.username.length > 0 && this.data.username.length < 3) this.errors.push('The username must be 3 characters at least');
    if(this.data.username.length > 20) this.errors.push('The username cannot exceed 20 characters');
}

// User.prototype.login = function(callback) {
//     this.cleanUp();
//     usersCollection.findOne({username: this.data.username}, (err, attemptedUser)=>{
//         if(attemptedUser && attemptedUser.password == this.data.password) {
//             callback('There are no errors');
//         } else {
//             callback('Invalid username / password');
//         }
//     });
// }

User.prototype.login = function(callback) {
    return new Promise((resolve, reject)=>{
        this.cleanUp();
        usersCollection.findOne({username: this.data.username})
        .then((attemptedUser)=>{
            if(attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
                resolve('There are no errors');
            } else {
                reject('Invalid username / password');
            }
        })
        .catch((err) => reject('Try again later!'));
    });
}

User.prototype.register = function() {
    this.cleanUp();
    // Step 1: Validate user data
    this.validate();
    // Step 2: Only if there are no validation errors then
    // save user data into a database
    if(!this.errors.length){
        // hash user's password
        const salt = bcrypt.genSaltSync(10);
        this.data.password = bcrypt.hashSync(this.data.password, salt); 
        usersCollection.insertOne(this.data);
    }
}

module.exports = User;
