const express = require('express');
const userRouter = express.Router();
const {
  createUser,
  getUserByEmail,
  getUsers
} = require('../mongo/crud/users');
const {
  findUserFromToken 
} = require('../mongo/auth');

userRouter.get('/', async (req, res, next) => {
  try {
    const email = req.query.email;
    let users;
    if (email) {
      users = await getUserByEmail(email);
    } else {
      users = await getUsers();
    }
    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
});

userRouter.get('/token', async (req, res, next) => {
  try {
    const user = await findUserFromToken(req.header.token);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

userRouter.post('/', async (req, res, next) => {
  try {
    const val = await createUser(req.body);
    res.status(201).send(val);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
