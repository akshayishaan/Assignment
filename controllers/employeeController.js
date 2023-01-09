const catchAsync = require('../utils/catchAsync');
const { Employee, Manager } = require('../models/employeeModel');
const AppError = require('../utils/appError');
const sendResponse = require('./responseController');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const deleteEmployeeAndUpdateManager = async (id) => {
  const employee = await Employee.findByIdAndDelete(id);
  const previousManger = employee.workingUnder;
  const employeeID = employee._id;
  await Manager.findOneAndUpdate(
    { _id: previousManger },
    { $pull: { subOrdinates: employeeID } }
  );
  return employee;
};

exports.getAllEmployees = catchAsync(async (req, res, next) => {
  const employees = await Employee.find();
  sendResponse(200, employees, res);
});

exports.getAllEmployeesWorkingUnderThisManager = catchAsync(
  async (req, res, next) => {
    const employees = await Employee.find({ workingUnder: req.params.id });
    sendResponse(200, employees, res);
  }
);

exports.getEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);
  sendResponse(200, employee, res);
});

exports.createEmployee = catchAsync(async (req, res, next) => {
  req.body.workingUnder = req.params.id;
  const employee = await Employee.create(req.body);
  const id = employee._id;
  await Manager.findByIdAndUpdate(req.params.id, {
    $push: { subOrdinates: id.toString() },
  });

  //! Consideration - As we can see, there are two queries to perfom this operation, So, we can use
  //!                 transactions here, so that if anyone fails, then it gets reverted back to
  //!                 original state.
  sendResponse(201, employee, res);
});

const updateEmployeeToManager = catchAsync(async (req, res, next) => {
  let employee = await deleteEmployeeAndUpdateManager(req.params.id);

  employee = { ...employee._doc };
  employee.post = undefined;
  employee.workingUnder = undefined;
  employee.subOrdinates = [];
  employee.salary = req.body.salary;

  const newManger = await Manager.create(employee);
  sendResponse(200, newManger, res);
});

exports.updateEmployee = catchAsync(async (req, res, next) => {
  if (!req.body.post || !req.body.salary) {
    return next(new AppError(`Please define the salary and post fields!`, 400));
  }

  if (req.body.post === 'manager') {
    return updateEmployeeToManager(req, res, next);
  }

  const filteredBody = filterObj(req.body, 'salary', 'post');

  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!employee)
    return next(
      new AppError(`No document found with this id: ${req.params.id}`, 404)
    );

  sendResponse(200, employee, res);
});

exports.deleteEmployee = catchAsync(async (req, res, next) => {
  await deleteEmployeeAndUpdateManager(req.params.id);
  sendResponse(204, null, res);
});
