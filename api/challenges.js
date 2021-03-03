const express = require('express');
const challengeRouter = express.Router();
const redisClient = require('redis').createClient(process.env.REDIS_URL);
const {
  createChallenge,
  getChallenges,
  getGameNames
} = require('../mongo/crud/challenges');
const { isLoggedIn, isAdmin } = require('../mongo/auth');
const Challenge = require('../mongo/models/challengesModel');

const checkCache = (req, res, next) => {
  const key = JSON.stringify(req.body);
  console.log('key in checkcache ', key)
  redisClient.get(key, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else if (data) {
      console.log('served up by redis');
      //console.log('games in redis ', JSON.stringify(data))
      res.send(data);
    }
    else {
      next();
    }
  });
};

challengeRouter.post('/games', checkCache, async (req, res, next) => {
  const key = JSON.stringify(req.body);
  console.log('key in gemes route', key)
  try {
    const games = await getChallenges(req.body);
    //console.log('games in route ', JSON.stringify(games))
    console.log('served up by mongo');
    redisClient.set(JSON.stringify(req.body), JSON.stringify({games}));
    redisClient.expire(JSON.stringify(req.body), 1000);
    res.status(201).send(games);
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
