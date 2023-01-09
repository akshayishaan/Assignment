const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A employee must have a name'],
  },
  address: {
    street: {
      type: String,
      required: [true, 'A employee must have their street address'],
    },
    'village/city': {
      type: String,
      required: [true, 'A employee must have their village or city'],
    },
    district: {
      type: String,
      required: [true, 'A employee must have their district'],
    },
    state: {
      type: String,
      required: [true, 'A employee must have their state'],
    },
  },
  contact: {
    email: {
      type: String,
      required: [true, 'A employee must have an email'],
    },
    phone: {
      type: String,
      required: [true, 'A employee must have a phone number'],
    },
  },
  department: {
    type: String,
    required: [true, `A employee must belong to any department`],
  },
  dob: {
    type: Date,
    required: [true, 'Please provide us your Date of Birth'],
  },
  gender: {
    type: String,
    required: [true, 'Please input your gender'],
    enum: ['male', 'female'],
  },
  hiringDate: {
    type: Date,
    default: Date.now(),
  },
  salary: {
    type: Number,
    required: [true, 'Please provide us the salary of an employee'],
  },
  subOrdinates: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Employee',
      },
    ],
    default: undefined,
  },
  post: {
    type: String,
    default: undefined,
  },
  workingUnder: {
    type: mongoose.Types.ObjectId,
    default: undefined,
  },
  //! Considerations - We can limit the posts by defining enum here - so that things will be
  //! super clear and people can't just put any posts in the body!
});

const Manager = mongoose.model('Manager', employeeSchema);
const Employee = mongoose.model('Employee', employeeSchema);
module.exports = { Manager, Employee };
