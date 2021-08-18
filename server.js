const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const userRouter = require('./api/users');
const challengeRouter = require('./api/challenges');
const authRouter = require('./api/auth');
const foxyRouter = require('./api/foxy');
const { findUserFromToken, isLoggedIn, isAdmin } = require('./mongo/auth');


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

const csrfProtection = csurf({
  cookie: true
});

app.use(cookieParser());
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
app.use('/user', csrfProtection, userRouter);
app.use('/challenge', isLoggedIn, csrfProtection, challengeRouter);
app.use('/auth', csrfProtection, authRouter);
app.use('/foxy', csrfProtection, foxyRouter);

app.get('/', csrfProtection, (req, res, next) => {
  try {
    res.cookie('CSRF_token', req.csrfToken()).sendFile(path.join(__dirname, 'index.html'))
  } catch (error) {
    next(error);
  }
});

app.get('/logo', (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, '/assets/images/logo.png'));
  } catch (error) {
    next(error)
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