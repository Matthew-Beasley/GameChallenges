const Mongoose = require('mongoose');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
Mongoose.connect(process.env.MONGOCONNSTR, { useUnifiedTopology: true, useNewUrlParser: true });
console.log('mongo connection string: ', process.env.MONGOCONNSTR)
const redisClient = require('redis').createClient(process.env.REDIS_URL);
redisClient.flushall();
console.log('Flushed all Redis Keys on startup');

module.exports = { Mongoose, redisClient };


