const { isValidObjectId } = require('mongoose');
const Mongoose = require('../client');
const Schema = Mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  notify: { type: Boolean }, 
  platforms: [String],
  decks: [{
    sku: { type: String, required: true },
    transaction: { type: String, required: true }
  }]
});

const User = Mongoose.model('User', userSchema);

module.exports = User;
