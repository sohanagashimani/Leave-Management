const mongoose = require("mongoose");
const staffSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      require: true,
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
      max: 20,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    phnumber: {
      type: String,
      required: true,
      min: 10,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Staff", staffSchema);
