const express = require('express');
const userRouter = express.Router();
const CryptoJS = require('crypto-js');
const {
  createUser,
  getUserByEmail,
  getUsers,
  updateDecks
} = require('../mongo/crud/users');
const {
  findUserFromToken,
  isLoggedIn, 
  isAdmin
} = require('../mongo/auth');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

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
    const val = await createUser(req.body);
    res.status(200).send(val);
  } catch (error) {
    next(error);
  }
});

userRouter.post('/updatedecks', isLoggedIn, async (req, res, next) => {
  try {
    const { email, decks } = req.body;
    updateDecks(email, decks);
    res.status(200).send('success in updatedecks');
  } catch (error) {
    next(error);
  }
});

userRouter.post('/mailgun', async (req, res, next) => {
  const { password, email, time } = req.body;
  console.log(password, email, time)
  //const bytes  = CryptoJS.AES.decrypt(creds, process.env.EMAILKEY);
  //var bytes = CryptoJS.HmacSHA256(creds, process.env.EMAILKEY);
  //const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.hex));
  //console.log('decrypted data ', decryptedData);
  res.status(200).send('in mailgun route')
});

module.exports = userRouter;
