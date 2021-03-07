const express = require('express');
const userRouter = express.Router();
const {
  createUser,
  getUserByEmail,
  getUserByUserName,
  getUsers
} = require('../mongo/crud/users');
const {
  findUserFromToken 
} = require('../mongo/auth');

userRouter.get('/', async (req, res, next) => {
  try {
    const userName = req.query.username;
    let users;
    if (userName) {
      users = await getUserByUserName(userName);
    } else {
      users = await getUsers();
    }
    res.status(200).send(users);
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
    const val = await createUser(req.body);
    //console.log('val in user post api ', val)
    res.status(201).send(val);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
