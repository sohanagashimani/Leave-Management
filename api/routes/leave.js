const router = require("express").Router();
const Leave = require("../models/Leave");
const Staff = require("../models/Staff");
// create a leave request
router.post("/", async (req, res) => {
  try {
    const newLeave = new Leave({
      userId: req.body.userId,
      subject: req.body.subject,
      department: req.body.department,
      isSick: req.body.isSick,
      body: req.body.body,
      byStaff: req.body.byStaff,
      byHod: req.body.byHod,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      subStaff: req.body.subStaff,
      name: req.body.name,
    });
    const savedLeave = await newLeave.save();
    res.status(200).json(savedLeave);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get hod specific leave requests
router.get("/hod/:department", async (req, res) => {
  try {
    const leave = await Leave.find({
      department: req.params.department,
      byStaff: 1,
    });
    res.status(200).json(leave);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// get staff specific leave requests
router.get("/staff/:staffname", async (req, res) => {
  try {
    const leave = await Leave.find({ subStaff: req.params.staffname });
    res.status(200).json(leave);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get all leave requests(principal)
router.get("/", async (req, res) => {
  try {
    const leave = await Leave.find({ byHod: 1 });
    res.status(200).json(leave);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get a leave request
router.get("/:userId", async (req, res) => {
  try {
    const leave = await Leave.find({ userId: req.params.userId });
    return res.status(200).json(leave);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//accepted/dec by staff
router.put("/:leaveId/:byStaff/:role/:leaveCount", async (req, res) => {
  try {
    // console.log(req.params.role);
    if (req.params.role === "Staff") {
      const leave = await Leave.findByIdAndUpdate(req.params.leaveId, {
        byStaff: req.params.byStaff,
      });
      return res.status(200).json("leave status provided");
    } else if (req.params.role === "Hod") {
      const leave = await Leave.findByIdAndUpdate(req.params.leaveId, {
        byHod: req.params.byStaff,
      });
      const leaveStatus = await Leave.findById(req.params.leaveId);
      const userId = await leaveStatus.userId;
      const user = await Staff.findById(userId);
      if (leaveStatus.byHod === 1) {
        if (user.type === "Regular") {
          const updatedLeaves = user.regularStaffLeaves - req.params.leaveCount;
          // console.log(updatedLeaves)
          await Staff.findByIdAndUpdate(user._id, {
            regularStaffLeaves: updatedLeaves,
          });
        } else {
          const updatedLeaves =
            user.probationStaffLeaves - req.params.leaveCount;
          await Staff.findByIdAndUpdate(user._id, {
            probationStaffLeaves: updatedLeaves,
          });
        }
      }
      return res.status(200).json("leave status approved");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
