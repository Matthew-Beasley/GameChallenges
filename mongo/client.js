const Mongoose = require('mongoose');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
console.log('connection string ', process.env.MONGOCONNSTR)
Mongoose.connect(process.env.MONGOCONNSTR, { useUnifiedTopology: true, useNewUrlParser: true });
//const db = mongoose.connection;

module.exports = Mongoose;
