const express = require('express');
const foxyRouter = express.Router();
const crypto = require('crypto');
const { request } = require('http');
const { addDeck } = require('../mongo/crud/users')
const foxyEncryptionKey = process.env.FOXY_ENCRYPTION_KEY;
const foxyStoreId = process.env.FOXY_STORE_ID;
const foxyStoreDomain = process.env.FOXY_STORE_DOMAIN;


const validSignature = (headers, payload) => {
  const referenceSignature = crypto.createHmac('sha256', foxyEncryptionKey).update(JSON.stringify(payload)).digest('hex');
  return headers['foxy-webhook-signature'] === referenceSignature;
};

const validRequest = (headers, body) => {
  if (!validSignature(headers, body)) {
    console.log(('validSignature is TRUE!'))
    return false;
  }
  if (headers.method !== 'POST' || 
      headers['foxy-store-domain'] !== 'thwartme.foxycart.com' ||
      headers['foxy-store-id ']!== '98241'
  ) {
    return false;
  }
  return true;
};

foxyRouter.post('/', async (req, res, next) => {
  try {
    if (validRequest(req.headers, req.body)) {
      console.log(req.body)
      res.status(200).json({ text: 'Success' });
    } else {
      res.status(403).json({ text: 'Not Authorized' });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = foxyRouter;