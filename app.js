const express = require('express');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('./src/routes'));

app.listen(3000, function () {
    console.log('App listening on port 3000!');
});