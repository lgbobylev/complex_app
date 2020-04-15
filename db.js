const dotenv = require('dotenv');
dotenv.config();

const mongodb = require('mongodb');

mongodb.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
    module.exports = client.db();
    const app = require('./app');
    app.listen(process.env.PORT, function(){
        console.log(`Server is listening on port ${process.env.PORT}`);
    });
});