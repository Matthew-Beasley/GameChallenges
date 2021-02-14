const Mongoose = require('../client');
const Schema = Mongoose.Schema;

const platformsSchema = new Schema({
  name: { type: String, required: true },
  games: { type: [String] },
  displayGames: { type: Boolean }
});

const Platform = Mongoose.model('platforms', platformsSchema);

module.exports = Platform;