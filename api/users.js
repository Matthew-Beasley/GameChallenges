const express = require('express');
const userRouter = express.Router();
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
const { SESClient, CloneReceiptRuleSetCommand } = require('@aws-sdk/client-ses');

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

userRouter.post('/sendmail', async (req, res, next) => {
  const { email, code } = req.body;
  const client = new SESClient({ region: 'us-west-2' });
  const params = {
    Destination: {
      ToAddresses: [ email ],
    },
    Message: {
      // required 
      Body: {
        // required 
        Html: {
          Charset: 'UTF-8',
          Data: 'HTML_FORMAT_BODY',
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'TEXT_FORMAT_BODY',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Thwartme new account verification',
      },
    },
    Source: 'SENDER_ADDRESS', // SENDER_ADDRESS
    ReplyToAddresses: [
      // more items 
    ],
  };
  const command = new CloneReceiptRuleSetCommand(params);
  try {
    const data = await client.send(command);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
