let User = function(form_data){
    this.data = form_data;
    this.errors = [];
}

User.prototype.validate = function(){
    // Check incoming form data. Does it provide valid values?
    if(this.data.username == '') this.errors.push('You must provide a username');
    if(this.data.email == '') this.errors.push('You must provide a valid email address');
    if(this.data.password == '') this.errors.push('You must provide a password');
}

User.prototype.register = function() {
    // Step 1: Validate user data
    this.validate();
    // Step 2: Only if there are no validation errors then
    // save user data into a database
}

module.exports = User;
