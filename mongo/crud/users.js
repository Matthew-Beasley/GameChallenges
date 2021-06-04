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

const addTransaction = async (transaction) => {
  const email = transaction.customer_email.trim();
  const user = await User.find({ email: email });
  if(transaction.status === 'captured') {
    if (!user[0].decks) {
      user[0]['decks'] = [];
    }
    const decks = new Set(...user[0].decks);
    decks.add( ...transaction._embedded['fx:items']);
    console.log('decks in crud: ', decks)
    await User.updateOne( { email: email }, { decks: decks } );
    user[0].transactions.push(transaction);
    await User.updateOne( { email: email }, { transactions: transaction });
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
  addTransaction,
  getUsers
};
