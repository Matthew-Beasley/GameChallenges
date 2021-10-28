if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const { redisClient } = require('../mongo/client');
const webhook = express.Router();
const crypto = require('crypto');
const { addTransaction } = require('../mongo/crud/users');
const foxyEncryptionKey = process.env.FOXY_ENCRYPTION_KEY;
const axios = require('axios');
const validator = require('validator');
const jwt = require('jwt-simple');

const validSignature = (headers) => {
  const referenceSignature = crypto.createHmac('sha256', foxyEncryptionKey).update(JSON.stringify(payload)).digest('hex');
  return headers['foxy-webhook-signature'] === referenceSignature;
};
  
const validRequest = (request) => {
  if (!validSignature(request.headers) || 
      request.method !== 'POST' || 
      request.headers['foxy-store-domain'] !== 'thwartme.foxycart.com' || 
      request.headers['foxy-store-id'] !== '98241') {
    return false;
  }
  return true;
};

webhook.post('/', async (req, res, next) => {
  try {
    if (validRequest(req) {
      addTransaction(req.body);
      res.status(200).json({ text: 'Success' });
    } else {
      res.status(403).json({ text: 'Not Authorized' });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = webhook;