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

const checkCache = () => {
  redisClient.get('foxy_accesstoken', (err, data) => {
    if (err) {
      console.log(err);
      return null;
    }
    else if (data) {
      console.log('data in checkCache: ', data)
      return JSON.parse(data);
    } else {
      console.log('no data in checkCache')
      return null;
    }
  });
};

const getRefreshToken = async () => {
  let token = checkCache();
  if (token) {
    console.log('token in getRefreshToken from checkCache: ', token)
    return token;
  } else {
    const encryptedHeader = `Basic ${Buffer.from(`${process.env.foxy_client_id}:${process.env.foxy_client_secret}`).toString('base64')}`;
    console.log('encryptedHeader in getRefreshToken: ', encryptedHeader)
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
      const accessToken = (await axios.post('https://api.foxycart.com/token', params, headers)).data.access_token;
      //console.log('FOXY ACCESS TOKEN SERVED UP BY foxycart.com/token');
      //redisClient.set('foxy_accesstoken', JSON.stringify(accessToken.data));
      //redisClient.expire('foxy_accesstoken', 7100);
      return accessToken;
    } catch (error) {
      console.log(error);
    }
  }
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
  console.log('req.query in sso ', req.query);
  console.log('req.headers ', req.headers);
  console.log('req ', req);
  const html = `
  <html>
    <head>
      <meta http-equiv="Refresh" content="20; URL=https://thwartme.foxycart.com/checkout?fcsid=${req.query.fcsid}">
    </head>
    <div>
      <h3>timestamp=${req.query.timestamp} fcsid=${req.query.fcsid}</h3>
    </div>
  </html>`;
  res.send(html);
});

foxyRouter.get('/sso', (req, res, next) => {
  console.log('req.query in sso ', req.query);
  console.log('req.headers ', req.headers);
  console.log('req ', req);
  const html = `
  <html>
    <head>
      <meta http-equiv="Refresh" content="20; URL=https://thwartme.foxycart.com/checkout?fcsid=${req.query.fcsid}">
    </head>
    <div>
      <h3>timestamp=${req.query.timestamp} fcsid=${req.query.fcsid}</h3>
    </div>
  </html>`;
  res.send(html);
});

foxyRouter.post('/createcustomer', async (req, res, next) => {
  const { email, password, first_name, last_name } = req.body;
  const token = await getRefreshToken();
  console.log('token in createuser route: ', token)
  const headers = {
    headers: { 
      'Authorization': token,
      'FOXY-API-VERSION': '1',
    }
  };
  // get store number and urls for api calls (call home)
  const homeData = (await axios.get('https://api.foxycart.com', headers)).data;
  // post user email (password?) and any other data wanted store userid returned
  const customerData = (await axios.post(`${homeData._links['fx:store']}`,
    { email, password, first_name, last_name }, headers)).data;
  console.log('customerData in createcusomer route: ', customerData)
  // set mongo customer id
  res.send(customerData)
});

module.exports = foxyRouter;