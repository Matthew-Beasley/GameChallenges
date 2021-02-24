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
  console.log('queryObj in crud ', queryObj);
  const challenges = await Challenge.find(queryObj);
  //const challenges = await Challenge.find( {$or: [{PC: true}, {Xbox: true}], OnLine: false} );
  //console.log(challenges);
  return challenges;
};

module.exports = {
  createChallenge,
  getChallenges
};