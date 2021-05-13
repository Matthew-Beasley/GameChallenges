const express = require('express');
const foxyRouter = express.Router();
const crypto = require('crypto');
const foxyEncryptionKey = process.env.FOXY_ENCRYPTION_KEY;
const foxyStoreId = process.env.FOXY_STORE_ID;
const foxyStoreDomain = process.env.FOXY_STORE_DOMAIN;

foxyRouter.post('/', async (req, res, next) => {
  try {
    console.log(req.headers);
    console.log(req.body);
    res.json({reply: 'hello back'});
  } catch (err) {
    next(err);
  }
});

module.exports = foxyRouter;