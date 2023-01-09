const catchAsync = require('../utils/catchAsync');
const { Manager } = require('../models/employeeModel');
const sendResponse = require('./responseController');

exports.getAllManagers = catchAsync(async (req, res, next) => {
  const managers = await Manager.find();
  sendResponse(200, managers, res);
});

exports.getManager = catchAsync(async (req, res, next) => {
  const manager = await Manager.findById(req.params.id);

  // ! We can also populate the query as well using populate, (But it affects the performance of query)
  // const manager = await Manager.findById(req.params.id).populate({
  //   path: 'subOrdinates',
  //   select:
  //     '-address -contact -department -dob -hiringDate -salary -_id -subOrdinates -__v',
  // });

  sendResponse(200, manager, res);
});

exports.createManager = catchAsync(async (req, res, next) => {
  const manager = req.body;
  await Manager.create(manager);
  sendResponse(200, manager, res);
});
