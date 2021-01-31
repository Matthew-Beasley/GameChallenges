const Mongoose = require('../client');
const Schema = Mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const User = Mongoose.model('User', userSchema);

module.exports = User;
