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
    //console.log('userName in get ', userName)
    let users;
    if (userName) {
      users = await getUserByUserName(userName);
      //console.log('after getUserByUserName', users)
    } else {
      users = await getUsers();
    }
    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
});

userRouter.post('/token', async (req, res, next) => {
  console.log(req.body.token);
  try {
    const user = await findUserFromToken(req.body.token);
    console.log('user after findUserFromToken in users/token api ', user)
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
