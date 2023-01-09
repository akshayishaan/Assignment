const express = require('express');
const morgan = require('morgan');
const managerRouter = require('./routes/managerRoutes');
const employeeRouter = require('./routes/employeeRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Middlewares
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use('/api/v1/organization/managers', managerRouter);
app.use('/api/v1/organization/employees', employeeRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`), 404);
});

app.use(globalErrorHandler);

module.exports = app;
