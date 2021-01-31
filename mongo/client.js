const Mongoose = require('mongoose');
Mongoose.connect('mongodb://localhost:27017/petitions', { useUnifiedTopology: true, useNewUrlParser: true });
//const db = mongoose.connection;

module.exports = Mongoose;
