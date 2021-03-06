const postCollection = require('../db').db().collection('posts');
const ObjectID = require('mongodb').ObjectID;

const Post = function(data, userid) {
    this.data = data;
    this.errors = [];
    this.userid = userid;
}

Post.prototype.cleanUp = function() {
    if(typeof this.data.title != 'string') {
        this.data.title = '';
    }
    if(typeof this.data.body != 'string') {
        this.data.body = '';
    }

    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        createdDate: new Date(),
        author: ObjectID(this.userid)
    };
}

Post.prototype.validate = function() {
    if(this.data.title == '') {
        this.errors.push('You must provide a title')
    }
    if(this.data.body == '') {
        this.errors.push('You must provide a body content')
    }
}

Post.prototype.create = function() {
    return new Promise(async (resolve, reject)=>{
        this.cleanUp();
        this.validate();
        if(!this.errors.length) {
            try { 
                await postCollection.insertOne(this.data);
                resolve('New post created!');
            } catch (error) {
                this.errors.push(error); 
                reject(this.errors);
            }
        } else {
            reject(this.errors);
        }
    });
}

module.exports = Post;