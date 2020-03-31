const express = require('express');
const app = express();
const router = require('./router');

app.use(express.static('public'));
// configure express app to use ejs html template 
app.set('views', 'views');
app.set('view engine', 'ejs');

app.use('/', router);

app.listen(3000, function(){
    console.log("Server is listening on port 3000");
});
