const express = require('express');
const userRouter = express.Router();
const CryptoJS = require('crypto-js');
const nodemailer = require('nodemailer');
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

userRouter.post('/mail', (req, res, next) => {

  const { password, email, first_name, last_name } = req.body;
  console.log(password, email, first_name, last_name)
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ password, email, first_name, last_name }), process.env.EMAILKEY);
  let url = '';
  if (process.env.NODE_ENV === 'test') {
    url = `http://localhost:3000?nonce=${encrypted}`;
  } else if (process.env.NODE_ENV === 'production') {
    url = `https://www.thwartme.com?nonce=${encrypted}`;
  }
  const htmlToSend = `<p>Click the link below to verify your thwartme account.</p>
<a href="${url}">Click here to verify your Thwartme account</a>           
<p>Your email will never be shared and this is the only email you will ever recieve from thwartme!</p>          
<p>Enjoy the game!</p>`;
  const transport = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 465,
    auth: {
      user: process.env.MAILGUN_USER,
      pass: process.env.MAILGUN_PASSWORD
    }
  });
  var mailOptions = {
    from: '"Thwartme development team" <conbecdevelopment@outlook.com>',
    to: email,
    subject: 'Thwartme user account confirmation',
    html: htmlToSend
  };
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send('Internal error, mail failed to send');
    } else {
      res.status(200).send('Mail sent')
    }
  });
});

userRouter.post('/contactus', (req, res, next) => {
  const { email , message } = req.body;
  const transport = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 465,
    auth: {
      user: process.env.MAILGUN_USER,
      pass: process.env.MAILGUN_PASSWORD
    }
  });
  var mailOptions = {
    from: email,
    to: 'conbecdevelopment@outlook.com',
    subject: 'Thwartme contact us email',
    text: message
  };
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send('Internal error, mail failed to send');
    } else {
      res.status(200).send('Mail sent')
    }
  });
});

module.exports = userRouter;
