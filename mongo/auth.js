const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const User = require('./models/userModel');

const findUserFromToken = async (token) => {
  const email = jwt.decode(token, process.env.JWT).email;
  const user = await User.find({ email: email });
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
        return reject(err);
      }
      if (verified) {
        return resolve('Accepted');
      }
      reject(Error('bad credentials'));
    });
  });
}

const authenticate = async ({ email, password }) => {
  const user = await User.find({ email: email });
  console.log(user)
  await compare({ plain: password, hashed: user.password });
  return jwt.encode({ email: user.email }, process.env.JWT);
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
