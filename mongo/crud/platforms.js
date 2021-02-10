const Platform = require('../models/platformsModel');

const createPlatform = (record) => {
  const platform = new Platform(record);
  platform.save(err => {
    if (err) {
      throw err;
    } else {
      return 'ok';
    }
  });
};

const getPlatforms = async() => {
  const platforms = await Platform.find();
  return platforms;
};

module.exports = {
  createPlatform,
  getPlatforms
};