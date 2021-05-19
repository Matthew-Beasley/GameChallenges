const express = require('express');
const foxyRouter = express.Router();
const crypto = require('crypto');
const { request } = require('http');
const { addDeck } = require('../mongo/crud/users');
const foxyEncryptionKey = process.env.FOXY_ENCRYPTION_KEY;
const foxyStoreId = process.env.FOXY_STORE_ID;
const foxyStoreDomain = process.env.FOXY_STORE_DOMAIN;


const validSignature = (headers, payload) => {
  const referenceSignature = crypto.createHmac('sha256', foxyEncryptionKey).update(JSON.stringify(payload)).digest('hex');
  return headers['foxy-webhook-signature'] === referenceSignature;
};

const validRequest = (request, body) => {
  if (!validSignature(request.headers, body)) {
    console.log(('validSignature is False!'));
    return false;
  }
  if (request.type !== 'POST' || 
    request.headers['foxy-store-domain'] !== 'thwartme.foxycart.com' || 
    request.headers['foxy-store-id'] !== '98241') {
    console.log('method ', request.method)
    console.log('store domain in headers', request.headers['foxy-store-domain']);
    console.log('store id in headers', request.headers['foxy-store-id']);
    return false;
  }
  console.log('store domain in headers', request.headers['foxy-store-domain']);
  console.log('store id in headers', request.headers['foxy-store-id']);
  return true;
};

foxyRouter.post('/', async (req, res, next) => {
  try {
    if (validRequest(req, req.body)) {
      console.log(req.body);
      res.status(200).json({ text: 'Success' });
    } else {
      res.status(403).json({ text: 'Not Authorized' });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = foxyRouter;