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

const getChallenges = async(queryObj) => {
  try {
    const challenges = await Challenge.find(queryObj);
    return challenges;
  } catch (error) {
    return error;
    //throw here?
  }
  
  
};

module.exports = {
  createChallenge,
  getChallenges
};