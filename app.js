const express = require('express');
const app = express();
require('dotenv').config();

const bodyParser = require('body-parser');
const mysqlConnection = require('./src/database/index');
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', require('./src/routes'));

app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});