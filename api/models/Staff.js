const mongoose = require("mongoose");
const staffSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      require: true,
      min: 3,
      unique: true,
    },
    staffName: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    password: {
      min: 3,
      type: String,
      required: true,
    },
    designation: {
      min: 2,
      type: String,
      required: true,
    },
    phnumber: {
      type: String,
      required: true,
      min: 10,
    },
    role: {
      type: String,
    },
    department: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    regularStaffLeaves: { type: Number, default: 12 },
    probationStaffLeaves: { type: Number, default: 0 },
    joiningDate: {
      type: Date,
      required: true,
    },
    tempDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Staff", staffSchema);
