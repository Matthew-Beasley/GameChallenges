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
  const email = transaction.customer_email;
  const user = await User.find({ email: email });
  if(transaction.status === 'captured') {
    if (!user[0].decks) {
      user[0].decks = [];
    }
    //console.log(transaction)
    user[0].decks.push({ sku: transaction.sku, transaction: transaction });
    //console.log(user[0].decks)
    //await User.updateOne( { email: email }, { decks: user[0].decks } );
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
