const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const postRoute = require('./routes/postRoutes');
const AppError = require('./utils/appError');
// eslint-disable-next-line import/newline-after-import

const postController = require('./controllers/postsController');
const app = express();

//Global middleware

//set security HTTP headers
app.use(helmet());

//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // maximum request
  standardHeaders: true,
  legacyHeaders: false,
  message: 'to many request from this IP , please try again in an hour!',
});
app.use('/api', limiter);

app.use(mongoSanitize());

app.use(xss());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// 3) ROUTES
app.use('/api/v1/post', postRoute);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `can't find ${req.originalUrl} on this server`,
  // });
  // const err = new Error(`can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`can't find ${req.originalUrl} on this server`, 400));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
});

module.exports = app;
