const express = require('express');
const foxyRouter = express.Router();

foxyRouter.post('/', async (req, res, next) => {
  try {
    console.log(req.body);
    res.json({reply: 'hello back'});
  } catch (err) {
    next(err);
  }
});

module.exports = foxyRouter;