const express = require('express');
if(process.env.ENV)
{require('dotenv').config();}
const challengeRouter = express.Router();
const {
  createChallenge,
  getChallenges,
  getGameNames,
  getDecks
} = require('../mongo/crud/challenges');
const { isLoggedIn, isAdmin } = require('../mongo/auth');
const Challenge = require('../mongo/models/challengesModel');


challengeRouter.post('/list', async (req, res, next) => {
  try {
    const data = await getChallenges(req.body);
    res.status(201).send({games: data});
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

challengeRouter.post('/decks', async (req, res, next) => {
  try {
    const decks = await getDecks(req.body);
    res.status(200).send(decks);
  } catch (error) {
    next(error);
  }
});

module.exports = challengeRouter;
