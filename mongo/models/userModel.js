const Mongoose = require('../client');
const Schema = Mongoose.Schema;

const userSchema = new Schema({
  userName: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true},
  notify: { type: Boolean }, 
  platforms: [String],
  gameTitles: [String],
  decks: [{}]
});

const User = Mongoose.model('User', userSchema);

module.exports = User;
