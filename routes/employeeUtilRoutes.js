const express = require('express');
const employeeController = require('../controllers/employeeController');

const router = express.Router({ mergeParams: true });

router
  .route('/employees')
  .post(employeeController.createEmployee)
  .get(employeeController.getAllEmployeesWorkingUnderThisManager);

module.exports = router;
