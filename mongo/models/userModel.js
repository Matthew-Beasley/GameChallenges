const Mongoose = require('../client');
const Schema = Mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  platforms: [String],
  gameTitles: [String],
  decks: [{}]
});

const User = Mongoose.model('User', userSchema);

module.exports = User;
