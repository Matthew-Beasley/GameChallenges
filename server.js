const express = require('express');
const path = require('path');
const app = express();
var cookieParser = require('cookie-parser')
var csrf = require('csurf')
var bodyParser = require('body-parser')
const userRouter = require('./api/users');
const challengeRouter = require('./api/challenges');
const authRouter = require('./api/auth');
const { findUserFromToken } = require('./mongo/auth');
var csrfProtection = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

if(process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    }  else {
      next();
    }
  });
}

app.use(cookieParser())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next();
  }
  findUserFromToken(token)
    .then(auth => {
      req.user = auth;
      next();
    })
    .catch(() => {
      const error = Error('not authorized');
      error.status = 401;
      next(error);
    });
});
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use('/user', userRouter);
app.use('/challenge', challengeRouter);
app.use('/auth', authRouter);

app.get('/', (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, 'index.html'));
  } catch (error) {
    next(error);
  }
});

//maybe rethink this error handling
app.use((req, res, next) => {
  next({
    status: 404,
    message: `Page not found for ${req.method} ${req.url}`,
  });
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    message: err.message || JSON.stringify(err),
  });
});

app.listen(process.env. PORT, () => console.log('Listening on PORT ', process.env.PORT));