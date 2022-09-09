const Mongoose = require('mongoose');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
Mongoose.connect(process.env.MONGOCONNSTR, { useUnifiedTopology: true, useNewUrlParser: true });

module.exports = { Mongoose };


