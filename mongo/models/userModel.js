const Mongoose = require('../client');
const Schema = Mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  gamerTag: { type: String, unique: true, required: true },
  platforms: [String],
  gameTitles: [String],
  decks: [{}]
});

const User = Mongoose.model('User', userSchema);

module.exports = User;
