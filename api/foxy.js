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

foxyRouter.get('/apitoken', async (req, res, next) => {
  //build token query
  const buf = Buffer.from(`${process.env.client_id}:${process.env.client_secret}`); 
  console.log(buf.toString('base64'))
  const encryptedHeader = `Basic ${buf.toString('base64')}`;
  const options = {
    headers: { 
      'Authorization': encryptedHeader,
      'FOXY-API-VERSION': '1',
      'Content-Type': 'application/hal+json',

    }
  };
  let accessToken = null;
  try {
  //get access token
    accessToken = await axios.post('https://api.foxycart.com/token', 
      { grant_type: 'refresh_token', refresh_token: process.env.refresh_token }, 
      options);
    console.log('accessToken ', accessToken);
    res.status(200).send({ token: accessToken });
  } catch (error) {
    res.send(error)
    next(error);
  }
  //put token in redis
  //res.status(200).send({ token: accessToken });
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