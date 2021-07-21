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
const mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_APIKEY, domain: 'thwartme.com'});

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
  const { password, email } = req.body;
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ password, email }), process.env.EMAILKEY);
  let url = '';
  process.env.NODE_ENV !== 'test' ? url = `https://thwartme.com?nonce=${encrypted}` : url = `http://localhost:3000?nonce=${encrypted}`;

  const data = {
    from: 'Thwartme.com <game-team@thwartme.com>',
    to: email,
    subject: 'Verify new thwartme account',
    text: `Click the link below to verify your thwartme account.

${url}
           
Your email will never be shared and this is the only email you will ever recieve from thwartme!
           
Enjoy the game!`
  };

  mailgun.messages().send(data, (error, body) => {
    console.log(body);
  });

  res.status(200).send('Sent verification email');
});

module.exports = userRouter;
