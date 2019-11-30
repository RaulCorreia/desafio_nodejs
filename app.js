const express = require('express');
const app = express();
require('dotenv').config();

const bodyParser = require('body-parser');
const mysqlConnection = require('./src/database/index');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', require('./src/routes'));

app.listen(3000, function () {
    console.log('App listening on port 3000!');
});