const express = require('express');
const platformsRouter = express.Router();
const {
  createPlatform,
  getPlatforms
} = require('../mongo/crud/platforms'); 

platformsRouter.post('/', async (req, res, next) => {
  try {
    const platform = await createPlatform(req.body);
    res.status(201).send(platform);
  } catch (error) {
    next(error);
  }
});

platformsRouter.get('/', async (req, res, next) => {
  try {
    const platforms = await getPlatforms();
    res.status(200).send(platforms);
  } catch (error) {
    next(error);
  }
});

module.exports = platformsRouter;