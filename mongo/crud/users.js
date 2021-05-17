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
      return err;
    } else {
      return 'success';
    }
  });
};

const getUserByEmail = async (email) => {
  const user = await User.find({email: email});
  return user;
};

const addDeck = async (transaction) => {
  transaction = JSON.parse(transaction);
  const email = transaction.email;
  const user = await User.find({ email: email });
  if(transaction.status === 'captured') {
    user.decks.push({ sku: transaction.sku, transaction: transaction });
    return true;
  }
  return false;
};

const getUsers = async () => {
  const users = await User.find();
  return users;
};

module.exports = {
  createUser,
  getUserByEmail,
  addDeck,
  getUsers
};
