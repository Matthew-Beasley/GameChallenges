if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const { redisClient } = require('../mongo/client');
const foxyRouter = express.Router();
const crypto = require('crypto');
const { addTransaction } = require('../mongo/crud/users');
const foxyEncryptionKey = process.env.FOXY_ENCRYPTION_KEY;
const axios = require('axios');
const validator = require('validator');
const jwt = require('jwt-simple');


const createURL = (fcsid, customerId) => {
  const timeStamp = (Date.now() + 600000);
  let stringToSign = `${customerId}|${timeStamp}|${process.env.FOXY_SECRET}`;
  let token = crypto.createHash('sha1').update('' + stringToSign).digest('hex');
  let uri = `https://thwartme.foxycart.com/checkout?fc_customer_id=${customerId}&timestamp=${timeStamp}&fc_auth_token=${token}`;
  if (fcsid && validator.isAlphanumeric(fcsid)) {
    uri += `&fcsid=${fcsid}`;
  }
  return uri;
};

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
  redisClient.get('foxyaccesstoken', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    else if (data) {
      console.log('FOXY ACCESS TOKEN SERVED UP BY REDIS');
      res.send(data);
    }
    else {
      next();
    } 
  });
};

foxyRouter.get('/apitoken', checkCache, async (req, res, next) => {
  const encryptedHeader = `Basic ${Buffer.from(`${process.env.foxy_client_id}:${process.env.foxy_client_secret}`).toString('base64')}`;
  const headers = {
    headers: { 
      'Authorization': encryptedHeader,
      'FOXY-API-VERSION': '1',
    }
  };
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', process.env.foxy_refresh_token);
  try {
    const accessToken = await axios.post('https://api.foxycart.com/token', params, headers);
    console.log('FOXY ACCESS TOKEN SERVED UP BY foxycart.com/token');
    redisClient.set('foxyaccesstoken', JSON.stringify(accessToken.data.access_token));
    redisClient.expire('foxyaccesstoken', 7100);
    res.status(200).send(JSON.stringify(accessToken.data.access_token));
  } catch (error) {
    next(error);
  }
});

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

foxyRouter.get('/sso', (req, res, next) => {
  try {
    console.log('req in /sso: ', req.query)
    const bouncedScript = `
    <html>
      <head>
        <meta http-equiv="refresh" content="0; URL=${process.env.DOMAIN}/foxy/checkout?sid=${req.query.fcsid}" />
      </head>
    </html>`;
    res.send(bouncedScript);
  } catch (err) {
    next();
  }
});

foxyRouter.get('/checkout', async (req, res, next) => {
  try {
    const foxyCustomer = jwt.decode(req.cookies['token'], process.env.JWT).foxy_id;
    const { sid } = req.query;
    const URL = createURL(sid, foxyCustomer);
    const html = `
    <html>
      <head>
        <meta http-equiv="refresh" content="0; URL=${URL}" />
      </head>
    </html>`;
    console.log('html in /checkout: ', html)
    res.status(200).send(html);
  } catch (error) {
    next(error.message);
  }
});

foxyRouter.post('/createcustomer', async (req, res, next) => {
  const { email, password, first_name, last_name, token } = req.body;
  const headers = {
    headers: { 
      'Authorization': `bearer ${token}`,
      'FOXY-API-VERSION': '1',
    }
  }; 
  try {
    const homeData = (await axios.get('https://api.foxycart.com', headers)).data;
    let customerData = (await axios.post(`${homeData._links['fx:store'].href}/customers`,
      { email, password, first_name, last_name }, headers)).data;
    const customerId = customerData.message.split(' ')[1];
    res.send(customerId);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = foxyRouter;