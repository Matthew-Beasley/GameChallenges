const express = require('express');
if(process.env.ENV)
{require('dotenv').config();}
const challengeRouter = express.Router();
const { redisClient } = require('../mongo/client');
const {
  createChallenge,
  getChallenges,
  getGameNames,
  getDecks
} = require('../mongo/crud/challenges');
const { isLoggedIn, isAdmin } = require('../mongo/auth');
const Challenge = require('../mongo/models/challengesModel');

const checkChallengeCache = (req, res, next) => {
  redisClient.get(JSON.stringify(req.body), (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else if (data) {
      res.send(JSON.parse(data));
    }
    else {
      next();
    }
  });
};

challengeRouter.post('/list', checkChallengeCache, async (req, res, next) => {
  try {
    const data = await getChallenges(req.body);
    redisClient.set(JSON.stringify(req.body), JSON.stringify({games: data}));
    redisClient.expire(JSON.stringify(req.body), 3600);
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

const checkDeckCache = (req, res, next) => {
  redisClient.get(req.body.DeckName, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else if (data) {
      res.send(JSON.parse(data));
    }
    else {
      next();
    }
  });
};

challengeRouter.post('/decks', checkDeckCache, async (req, res, next) => {
  try {
    const decks = await getDecks(req.body);
    redisClient.set(req.body.DeckName, JSON.stringify(decks));
    redisClient.expire(req.body.DeckName, 3600);
    res.status(200).send(decks);
  } catch (error) {
    next(error);
  }
});

module.exports = challengeRouter;
