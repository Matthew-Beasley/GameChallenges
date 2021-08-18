const express = require('express');
const authRouter = express.Router();
const {
  findUserFromToken,
  authenticate,
  compare,
  hash
} = require('../mongo/auth');

authRouter.get('/', async (req, res, next) => {
  try {
    const { email, password } = req.headers;
    console.log('credentials in auth ', email, password)
    const token = await authenticate({ email, password });
    console.log('token in auth ', token)
    res.status(201).send(token);
  } catch (error) {
    next(error);
  }
});

authRouter.post('/', async (req, res, next) => {
  try {
    const token = await authenticate(req.body);
    res.status(201).send(token);
  } catch (error) {
    next(error);
  }
});

module.exports = authRouter;
