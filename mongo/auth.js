const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const User = require('./models/userModel');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

console.log('process env jwt in auth ', process.env.JWT)

const findUserFromToken = async (token) => {
  const userName = jwt.decode(token, process.env.JWT).userName;
  const user = await User.find({ userName: userName });
  delete user.password;
  return user;
};

const hash = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hashed) => {
      if (err) {
        return reject(err);
      }
      return resolve(hashed);
    });
  });
};

const compare = ({ plain, hashed }) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plain, hashed, (err, verified) => {
      if (err) {
        console.log('bcrypt error', err)
        return reject(err);
      }
      if (verified) {
        return resolve('Accepted');
      }
      reject(Error('bad credentials'));
    });
  });
};

const authenticate = async ({ username, password }) => {
  const users = await User.find({ userName: username });
  await compare({ plain: password, hashed: users[0].password });
  return jwt.encode({ userName: users[0].userName }, process.env.JWT);
};

const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    const error = Error('not authorized');
    error.status = 401;
    return next(error);
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.isAdmin !== true) {
    return next(Error('not authorized'));
  }
  next();
};

module.exports = {
  findUserFromToken,
  authenticate,
  compare,
  hash,
  isLoggedIn,
  isAdmin
};
