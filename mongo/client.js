const Mongoose = require('mongoose');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
Mongoose.connect(process.env.MONGOCONNSTR, { useUnifiedTopology: true, useNewUrlParser: true });
//const db = mongoose.connection;
const redisClient = require('redis').createClient(process.env.REDIS_URL);

module.exports = { Mongoose, redisClient };


