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
const https = require('http');


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
  redisClient.get('foxy_accesstoken', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else if (data) {
      console.log('FOXY ACCESS TOKEN SERVED UP BY REDIS');
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

foxyRouter.get('/datafeed', (req, res, next) => {
  console.log(req.body);
  res.send('foxy');
});

foxyRouter.get('/apitoken', checkCache, async (req, res, next) => {
  const encryptedHeader = `Basic ${Buffer.from(`${process.env.foxy_client_id}:${process.env.foxy_client_secret}`).toString('base64')}`;
  const headers = {
    headers: { 
      'Authorization': encryptedHeader,
      'FOXY-API-VERSION': '1',
    }
  };
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token')
  params.append('refresh_token', process.env.foxy_refresh_token);
  try {
    const accessToken = await axios.post(' https://api.foxycart.com/token', params, headers);
    console.log('FOXY ACCESS TOKEN SERVED UP BY foxycart.com/token');
    redisClient.set('foxy_accesstoken', JSON.stringify(accessToken.data));
    redisClient.expire('foxy_accesstoken', 7100);
    res.status(200).send({ token: accessToken.data });
  } catch (error) {
    console.log(error.response.data);
    next(error);
  }
});

module.exports = foxyRouter;