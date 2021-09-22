let express = require('express');
let path = require('path');
let app = express();
let bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../../../')));

// create application/x-www-form-urlencoded parser
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);


app.listen(3001);