const Mongoose = require('../client');
const Schema = Mongoose.Schema;

const challengesSchema = new Schema({
  deckname: { type: String, required: true },
  instructions: { type: String, required: true },
  platforms: [String],
  gameTitles: [String],
  doesOwn: false,
  complete: false
});

const Challenge = Mongoose.model('Challenge', challengesSchema);

module.exports = Challenge;