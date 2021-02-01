const Mongoose = require('mongoose');
Mongoose.connect('mongodb://localhost:27017/gamechallenges', { useUnifiedTopology: true, useNewUrlParser: true });
//const db = mongoose.connection;

module.exports = Mongoose;
