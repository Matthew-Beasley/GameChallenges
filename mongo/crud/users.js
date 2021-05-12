const User = require('../models/userModel');
const {
  findUserFromToken,
  authenticate,
  compare,
  hash
} = require('../auth');

const createUser = async (record) => {
  let returnVal = '';
  const { password } = record;
  const pwd = await hash(password);
  record.password = pwd;
  const user = new User(record);
  user.save(err => {
    if (err) {
      console.log('in err ', user)
      console.log('err ', err)
      return err;
    } else {
      console.log('in success ', user)
      return 'success';
    }
  });
};

const getUserByEmail = async (email) => {
  const user = await User.find({email: email});
  return user;
};

const getUsers = async () => {
  const users = await User.find();
  return users;
};

module.exports = {
  createUser,
  getUserByEmail,
  getUsers
};
