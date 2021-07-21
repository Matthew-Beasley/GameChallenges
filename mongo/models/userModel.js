const { isValidObjectId } = require('mongoose');
const Mongoose = require('../client');
const Schema = Mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  platforms: [ String ],
  transactions: [ Schema.Types.Mixed ],
  decks: [ Schema.Types.Mixed ]
});

const User = Mongoose.model('User', userSchema);

module.exports = User;
