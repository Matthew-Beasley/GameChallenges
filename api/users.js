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
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

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
  const { password, email, first_name, last_name } = req.body;
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ password, email, first_name, last_name }), process.env.EMAILKEY);
  let url = '';
  process.env.NODE_ENV !== 'test' ? url = `https://thwartme.com?nonce=${encrypted}` : url = `http://localhost:3000?nonce=${encrypted}`;
  const mailgunAuth = {
    auth: {
      api_key: process.env.MAILGUN_APIKEY,
      domain: 'thwartme.com'
    }
  };
  const smtpTransport = nodemailer.createTransport(mg(mailgunAuth));
  const textToSend = `Click the link below to verify your thwartme account.

${url}
           
Your email will never be shared and this is the only email you will ever recieve from thwartme!
           
Enjoy the game!`;
  const mailOptions = {
    from: 'Thwartme.com <game-team@thwartme.com>',
    to: email,
    subject: 'Verify new thwartme account',
    text: textToSend
  };
  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send(response);
    }
  });
});

module.exports = userRouter;
