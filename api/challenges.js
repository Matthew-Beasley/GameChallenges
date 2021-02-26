const express = require('express');
const challengeRouter = express.Router();
const {
  createChallenge,
  getChallenges
} = require('../mongo/crud/challenges');
const { isLoggedIn, isAdmin } = require('../mongo/auth');

challengeRouter.post('/games', async (req, res, next) => {
  try {
    const challenges = await getChallenges(req.body);
    res.status(200).send(challenges);
  } catch (error) {
    next(error);
  }
});

challengeRouter.post('/', async (req, res, next) => {
  try {
    const val = await createChallenge(req.body);
    res.status(201).send(val);
  } catch (error) {
    next(error);
  }
});

module.exports = challengeRouter;
