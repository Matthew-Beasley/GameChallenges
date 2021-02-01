const express = require('express');
const challengeRouter = express.Router();
const {
  createChallenge,
  getChallenges
} = require('../mongo/crud/challenges');

challengeRouter.get('/', async (req, res, next) => {
  try {
    const users = await getChallenges();
    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
});

challengeRouter.post('/', async (req, res, next) => {
  try {
    const val = await createChallenge(req.body)
    res.status(201).send(val);
  } catch (error) {
    next(error);
  }
});

module.exports = challengeRouter;
