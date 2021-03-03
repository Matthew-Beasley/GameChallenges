const express = require('express');
const challengeRouter = express.Router();
const {
  createChallenge,
  getChallenges,
  getGameNames
} = require('../mongo/crud/challenges');
const { isLoggedIn, isAdmin } = require('../mongo/auth');
const Challenge = require('../mongo/models/challengesModel');

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

challengeRouter.get('/gamenames', async (req, res, next) => {
  try {
    const names = await getGameNames();
    res.status(200).send(names);
  } catch (error) {
    next(error);
  }
});

module.exports = challengeRouter;
