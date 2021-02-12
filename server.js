const sslRedirect = require('heroku-ssl-redirect');
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const userRouter = require('./api/users');
const challengeRouter = require('./api/challenges');
const authRouter = require('./api/auth');
const platformsRouter = require('./api/platforms');
const { findUserFromToken } = require('./mongo/auth');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

console.log('environment is ', process.env.NODE_ENV)

//if (process.env.NODE_ENV === 'production') {
  app.use(sslRedirect());
//}

app.use(cors());
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
app.use('/platform', platformsRouter)

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