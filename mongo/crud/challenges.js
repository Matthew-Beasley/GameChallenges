const Challenge = require('../models/challengesModel');

const createChallenge = (record) => {
  const challenge = new Challenge(record);
  challenge.save(err => {
    if (err) {
      throw err;
    } else {
      return 'ok';
    }
  });
};

const getChallenges = async (queryObj) => {
  try {
    const challenges = await Challenge.find(queryObj);
    return challenges;
  } catch (error) {
    return error;
    //throw here?
  }
};

const getGameNames = async () => {
  try {
    const challenges = await Challenge.find({}, {Game: 1, _id: 0});
    return challenges;
  } catch (error) {
    return error;
    //throw here?
  }
};

const getDecks = async ({ DeckName, DeckCode }) => {
  try {
    console.log('------------- DeckName in getDecks -------------:', DeckName)
    const name = DeckName.slice(0, DeckName.indexOf(' deck '));
    const deck = parseInt(DeckCode.replace(`${name}`, ''));
    const decks = await Challenge.find({ Game: name, Deck: deck }).exec();
    console.log('-------------- decks from mongo in crud -------------------:', decks)
    return decks;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createChallenge,
  getChallenges,
  getGameNames,
  getDecks
};