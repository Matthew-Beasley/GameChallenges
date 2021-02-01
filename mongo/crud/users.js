const User = require('../models/userModel');

const createUser = (record) => {
  const user = new User(record);
  user.save(err => {
    if (err) {
      throw err;
    } else {
      return 'ok';
    }
  });
}

const getUsers = async() => {
  const users = await User.find();
  return users;
}

module.exports = {
  createUser,
  getUsers
}
