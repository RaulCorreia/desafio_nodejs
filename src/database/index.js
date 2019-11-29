const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/desafio', { useMongoClient: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;