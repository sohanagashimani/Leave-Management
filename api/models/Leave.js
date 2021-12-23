const mongoose = require("mongoose");
const LeaveSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      max: 50,
    },
    department: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    body: {
      type: String,
      required: true,
    },
    dateStart: {
      type: Date,
      required: true,
    },
    dateEnd: {
      type: Date,
      required: true,
    },
    subStaff: {
      type: String,
      required: true,
    },
    byStaff: {
      type: Number,
      default: 0,
    },
    byHod: {
      type: Number,
      default: 0,
    },
    byAdmin: {
      type: Number,
      default: 0,
    },
    noOfDays: {
      type: Number
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Leave", LeaveSchema);
