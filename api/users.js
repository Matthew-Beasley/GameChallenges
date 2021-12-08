const express = require('express');
const userRouter = express.Router();
const CryptoJS = require('crypto-js');
const {
  createUser,
  getUserByEmail,
  updateDecks
} = require('../mongo/crud/users');
const {
  findUserFromToken,
  isLoggedIn
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

userRouter.post('/mailgun', (req, res, next) => {
  const { password, email, first_name, last_name } = req.body;
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ password, email, first_name, last_name }), process.env.EMAILKEY);
  let url = '';
  if (process.env.NODE_ENV === 'test') {
    url = `http://localhost:3000?nonce=${encrypted}`;
  } else if (process.env.NODE_ENV === 'staging') {
    url = `http://fathomless-escarpment-51259.herokuapp.com?nonce=${encrypted}`;
  } else if (process.env.NODE_ENV === 'production') {
    url = `http://thwartme.com?nonce=${encrypted}`;
  }
  const mailgunAuth = {
    auth: {
      api_key: process.env.MAILGUN_APIKEY,
      domain: 'thwartme.com'
    }
  };
  const smtpTransport = nodemailer.createTransport(mg(mailgunAuth));
  const htmlToSend = `<p>Click the link below to verify your thwartme account.</p>
<a href="${url}">Click here to verify your Thwartme account</a>           
<p>Your email will never be shared and this is the only email you will ever recieve from thwartme!</p>          
<p>Enjoy the game!</p>`;
  const mailOptions = {
    from: 'Thwartme.com <game-team@thwartme.com>',
    to: email,
    subject: 'Verify new thwartme account',
    html: htmlToSend
  };
  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send(response);
    }
  });
});

userRouter.post('/contactus', (req, res, next) => {
  const { email , message } = req.body;
  const mailgunAuth = {
    auth: {
      api_key: process.env.MAILGUN_APIKEY,
      domain: 'thwartme.com'
    }
  };
  const smtpTransport = nodemailer.createTransport(mg(mailgunAuth));
  const mailOptions = {
    from: 'Thwartme.com <contactus@thwartme.com>',
    to: 'conbecdevelopment@outlook.com',
    subject: 'Contact Us',
    text: `From: ${email}
      ${message}`
  };
  try {
    smtpTransport.sendMail(mailOptions, (error, response) => {
      if (error) {
        next(error);
      } else {
        res.status(200).send(response);
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
