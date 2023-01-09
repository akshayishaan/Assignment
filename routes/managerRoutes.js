const express = require('express');
const managerController = require('../controllers/managerController');
const employeeUtilRouter = require('./employeeUtilRoutes');

const router = express.Router();

router
  .route('/')
  .get(managerController.getAllManagers)
  .post(managerController.createManager);
router.route('/:id').get(managerController.getManager);
router.use('/:id', employeeUtilRouter);
module.exports = router;
