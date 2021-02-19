const Mongoose = require('../client');
const Schema = Mongoose.Schema;

const challengesSchema = new Schema({
  PC: { type: Boolean },
  Xbox: { type: Boolean },
  PS: { type: Boolean },
  Switch: { type: Boolean },
  Mobile: { type: Boolean },
  Players: { type: Number },
  SplitScreen: { type: Boolean },
  KidFriendly: { type: Boolean },
  Online: { type: Boolean },
  TimeLimit: { type: String },
  Attempts: { type: Number },
  Game: { type: String , required: true},
  Challenge: { type: String, required: true, unique: true },
  DeckNumber: [Number]
});

const Challenge = Mongoose.model('Challenge', challengesSchema);

module.exports = Challenge;