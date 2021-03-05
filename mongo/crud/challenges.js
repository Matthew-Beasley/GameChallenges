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
    console.log('challenges ', challenges)
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

module.exports = {
  createChallenge,
  getChallenges,
  getGameNames
};