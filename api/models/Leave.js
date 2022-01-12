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
    designation: {
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
    },
    type: {
      type: String,
      required: true,
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
    subStaffArr: {
      type: Array,
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
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Leave", LeaveSchema);
