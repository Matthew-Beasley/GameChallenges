if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const { redisClient } = require('../mongo/client');
const foxyRouter = express.Router();
const crypto = require('crypto');
const { request } = require('http');
const { addTransaction } = require('../mongo/crud/users');
const foxyEncryptionKey = process.env.FOXY_ENCRYPTION_KEY;
const axios = require('axios');
const foxyStoreId = process.env.FOXY_STORE_ID;
const foxyStoreDomain = process.env.FOXY_STORE_DOMAIN;
// Need API keys here


const validSignature = (headers, payload) => {
  const referenceSignature = crypto.createHmac('sha256', foxyEncryptionKey).update(JSON.stringify(payload)).digest('hex');
  return headers['foxy-webhook-signature'] === referenceSignature;
};

const validRequest = (request, body) => {
  if (request.method !== 'POST' || 
    request.headers['foxy-store-domain'] !== 'thwartme.foxycart.com' || 
    request.headers['foxy-store-id'] !== '98241') {
    return false;
  }
  return true;
};

const checkCache = (req, res, next) => {
  redisClient.get(JSON.stringify(req.body), (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else if (data) {
      console.log('SERVED UP BY REDIS');
      res.send(JSON.parse(data));
    }
    else {
      next();
    }
  });
};

foxyRouter.post('/', async (req, res, next) => {
  try {
    if (validRequest(req, req.body)) {
      addTransaction(req.body);
      res.status(200).json({ text: 'Success' });
    } else {
      res.status(403).json({ text: 'Not Authorized' });
    }
  } catch (err) {
    next(err);
  }
});

foxyRouter.get('/apitoken', checkCache, async (req, res, next) => {
  //build token query
  const buf = Buffer.from(`${process.env.client_id}:${process.env.client_secret}`); 
  const encryptedHeader = `Basic ${buf.toString('base64')}`;
  console.log(encryptedHeader)
  const options = {
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `basic_auth ${encryptedHeader}` }
  };
  try {
  //get access token
    const accessToken = await axios.post('https://api.foxycart.com/token', 
      { grant_type: 'refresh_token', refresh_token: 'skwuCRHXvNh2GSy4WUugKa9eqC6YwmrLczfF6kAZ' }, 
      options);
    console.log(accessToken);
    res.status(200).send({ token: accessToken });
  } catch (error) {
    next(error);
  }
  //put token in redis
  //res.status(200).send({ token: accessToken });

  //respond with token
});
/*
challengeRouter.post('/list', checkCache, async (req, res, next) => {
  try {
    const data = await getChallenges(req.body);
    console.log('SERVED UP BY MONGO');
    redisClient.set(JSON.stringify(req.body), JSON.stringify({games: data}));
    redisClient.expire(JSON.stringify(req.body), 1200);
    res.status(201).send({games: data});
  } catch (error) {
    next(error);
  }
});
*/
module.exports = foxyRouter;