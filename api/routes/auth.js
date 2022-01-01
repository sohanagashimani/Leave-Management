const router = require("express").Router();
const bcrypt = require("bcrypt");
const Staff = require("../models/Staff");
const { body, validationResult } = require("express-validator");

// create a staff
router.post(
  "/register",
  [
    body("email", "enter a valid email").isEmail(),
    body("phnumber", "enter a valid phone-number").isMobilePhone(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ errors: errors.array() });
    }
    try {
      let user = await Staff.findOne({
        $or: [
          { email: req.body.email },
          { staffId: req.body.staffId },
          { phnumber: req.body.phnumber },
        ],
      });
      
      if (user) {
        if (user.email === req.body.email) {
          return res.status(200).json({
            success: false,
            msg: " A user with this email already exists",
          });
        } else if (user.staffId === req.body.staffId) {
          return res.status(200).json({
            success: false,
            msg: " A user with this Staff Id already exists",
          });
        } else {
          return res.status(200).json({
            success: false,
            msg: " A user with this phone number already exists",
          });
        }
      }
      //generating password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const dt = new Date(req.body.joiningDate);

      // creating user
      user = new Staff({
        staffName: req.body.staffName,
        staffId: req.body.staffId,
        email: req.body.email,
        password: hashedPassword,
        phnumber: req.body.phnumber,
        role: req.body.role,
        department: req.body.department,
        type: req.body.type,
        joiningDate: dt,
        tempDate: dt,
      });
    
      // save user and send response
      const saved = await user.save();
      success = true;
      return res.status(200).json({ success: true, user });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// Login
router.post("/login", async (req, res) => {
  try {
    let user = await Staff.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(200).json({ msg: "user not found", success: false });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(200).json({ msg: "wrong password", success: false });
    }
    if (user.type !== "Regular") {
      const joiningYear = user.joiningDate.getFullYear();
      const currentYear = new Date().getFullYear();
      const typeChange = currentYear - joiningYear;

      if (typeChange !== 0) {
        const currentDate = new Date();
        const regularBalance = 11 - joiningMonth;
        await Staff.findByIdAndUpdate(user._id, {
          type: "Regular",
          regularStaffLeaves: regularBalance,
          tempDate: currentDate,
        });
        return res.status(200).json({ user, success: true });
      } else {
        const currentMonth = new Date().getMonth();
        const tempMonth = user.tempDate.getMonth();
        const monthChange = currentMonth - tempMonth;
        if (monthChange !== 0) {
          const currentDate = new Date();
          const updatedProbationLeaves =
            user.probationStaffLeaves + monthChange;
          await Staff.findByIdAndUpdate(user._id, {
            probationStaffLeaves: updatedProbationLeaves,
            tempDate: currentDate,
          });
          user = await Staff.findOne({
            email: req.body.email,
          });
          return res.status(200).json({ user, success: true });
        } else {
          return res.status(200).json({ user, success: true });
        }
      }
    } else if (user.role === "Admin") {
      const dateObj = new Date();
      const month = dateObj.getUTCMonth() + 1; //months from 1-12
      const day = dateObj.getUTCDate();
      const year = dateObj.getUTCFullYear();
      const newdate = year + "/" + month + "/" + day;
      const yearBegins = new Date(dateObj.getFullYear(), 0, 1);
      const janYear = yearBegins.getFullYear();
      const firstOfJan = janYear + "/" + 12 + "/" + 24;
      if (newdate === firstOfJan) {
        await Staff.updateMany(
          { type: "Regular" },
          {
            regularStaffLeaves: 12,
          }
        );
      }
      return res.status(200).json({ user, success: true });
    } else if (user.type === "Regular") {
      const currentDate = new Date();
      const tempDate = new Date(user.tempDate);
      const totalSeconds = (currentDate - tempDate) / 1000;
      const days = Math.floor(totalSeconds / 3600 / 24);
      console.log(tempDate, currentDate, days);
      const yearChange = days;

      if (yearChange >= 365) {
        const updatedEarnedLeaves = user.earnedLeaves + 10;
        await Staff.findByIdAndUpdate(user._id, {
          tempDate: currentDate,
          earnedLeaves: updatedEarnedLeaves,
        });
        user = await Staff.findOne({
          email: req.body.email,
        });
        return res.status(200).json({ user, success: true });
      }
      return res.status(200).json({ user, success: true });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
