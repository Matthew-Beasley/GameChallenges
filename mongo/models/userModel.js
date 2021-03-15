const Mongoose = require('../client');
const Schema = Mongoose.Schema;

const userSchema = new Schema({
  userName: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, unique: true},
  notify: { type: Boolean }, 
  platforms: [String],
  decks: [{game: {type: String, deck: {type: Number}}}]
});

const User = Mongoose.model('User', userSchema);

module.exports = User;
