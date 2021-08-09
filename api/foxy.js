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
const validator = require('validator');


const createURL = (fcsid, customerId) => {
  // Need to figure out how to get the customer id here
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
      //console.log('data in checkCache', data)
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
  //console.log('encryptedHeader: ', encryptedHeader)
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', process.env.foxy_refresh_token);
  try {
    //console.log('')
    const accessToken = await axios.post('https://api.foxycart.com/token', params, headers);
    console.log('FOXY ACCESS TOKEN SERVED UP BY foxycart.com/token');
    redisClient.set('foxyaccesstoken', JSON.stringify(accessToken.data.access_token));
    redisClient.expire('foxyaccesstoken', 7100);
    res.status(200).send(JSON.stringify(accessToken.data.access_token));
  } catch (error) {
    console.log(error.response.data);
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
/*
foxyRouter.get('/datafeed', (req, res, next) => {
  console.log('req.query in datafeed ', req.query);
  console.log('req.headers ', req.headers);
  console.log('req ', req);
  const URL = createURL(req.query.fcsid, 31862687);
  const html = `
  <html>
    <head>
      <meta http-equiv="Refresh" content="10; URL=${URL}">
    </head>
    <div>
      <h3>timestamp=${req.query.timestamp} fcsid=${req.query.fcsid}</h3>
    </div>
  </html>`;
  res.send(html);
});
*/
foxyRouter.get('/sso', async (req, res, next) => {
  try {
    const URL = createURL(req.query.fcsid, 31862687);
    console.log('req.query in sso: ', req.query);
    console.log('req.headers in sso: ', req.headers);
    console.log('req.body in sso: ', req.body);
    console.log('URL in sso redirect: ' , URL);
    const html = `
    <html>
      <head>
        <meta http-equiv="refresh" content="5; URL=${URL}" />
      </head>
      <body>
        <div>
          <h3>Redirect URL ${URL}</h3>
        </div>
      </body>
    </html>`;
    res.send(html);
  } catch (error) {
    next();
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
    console.log('customerData in createcusomer route: ', customerData);
    const customerId = customerData.message.split(' ')[1];
    res.send(customerId);
  } catch (error) {
    console.log(error);
    next();
  }
});

module.exports = foxyRouter;