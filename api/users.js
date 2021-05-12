const express = require('express');
const userRouter = express.Router();
const {
  createUser,
  getUserByEmail,
  getUsers
} = require('../mongo/crud/users');
const {
  findUserFromToken,
  isLoggedIn, 
  isAdmin
} = require('../mongo/auth');

userRouter.get('/', async (req, res, next) => {
  try {
    const email = req.query.email;
    let user;
    if (email) {
      user = await getUserByEmail(email);
    }
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

userRouter.post('/token', async (req, res, next) => {
  try {
    const user = await findUserFromToken(req.body.token);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

userRouter.post('/', async (req, res, next) => {
  try {
    console.log('req in create user api ', req.body)
    const val = await createUser(req.body);
    res.status(201).send(val);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
