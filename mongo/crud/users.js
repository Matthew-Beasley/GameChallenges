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
    if (!user[0].decks) { //Do I need this?
      user[0]['decks'] = [];
    }
    const purchasedDecks = [...transaction._embedded['fx:items']];
    const codes = user[0].decks.map(deck => deck.code);
    const uniqueDecks = purchasedDecks.reduce((accum, item) => {
      if(!codes.includes(item.code)) {
        accum.push(item);
      }
      return accum;
    }, []);
    const allDecks = [...user[0].decks, ...uniqueDecks];
    await User.updateOne( { email: email }, { decks: allDecks });
    user[0].transactions.push(transaction);
    await User.updateOne( { email: email }, { transactions: user[0].transactions });
    return true;
  }
  return false;
};

const getUsers = async () => {
  const users = await User.find();
  return users;
};

const updateDecks = async (email, decks) => {
  try {
    await User.updateOne({ email: email }, { decks: decks });
  } catch(err) {
    return err;
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  addTransaction,
  getUsers,
  updateDecks
};
