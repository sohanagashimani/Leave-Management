const router = require("express").Router();
const bcrypt = require("bcrypt");
const Staff = require("../models/Staff");
const { body, validationResult } = require("express-validator");

// create a staff
router.post(
  "/register",
  [
    body("email", "Enter a valid email").isEmail(),
    body("phnumber", "Enter a valid phone-number").isMobilePhone(),
    body("staffName", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Enter a valid password").isLength({ min: 3 }),
    body("designation", "Enter a valid designation").isLength({ min: 2 }),
    body("staffId", "Enter a valid staffId").isLength({ min: 1 }),
    body("joiningDate", "Enter a valid date").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send(errors.array());
    }
    try {
      let user = await Staff.findOne({
        $or: [{ email: req.body.email }, { staffId: req.body.staffId }],
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
        designation: req.body.designation,
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
      return res.status(200).json({ msg: "User not found", success: false });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(200).json({ msg: "Wrong password", success: false });
    }
    if (user.type !== "Regular") {
      const currentDate = new Date();
      const tempDate = new Date(user.tempDate);
      const totalSeconds = (currentDate - tempDate) / 1000;
      const days = Math.floor(totalSeconds / 3600 / 24);
      // console.log(tempDate, currentDate, days);
      if (days >= 365) {
        const currentDate = new Date();
        const joiningMonth = new Date(user.joiningDate).getMonth();
        console.log(joiningMonth);
        const regularBalance = 11 - joiningMonth;
        await Staff.findByIdAndUpdate(user._id, {
          type: "Regular",
          regularStaffLeaves: regularBalance,
          tempDate: currentDate,
        });
        return res.status(200).json({ user, success: true });
      } else {
        if (new Date().getDate() >= new Date(user.joiningDate).getDate()) {
          const currentMonth = new Date().getMonth();
          // console.log(currentMonth);
          const tempMonth = user.tempDate.getMonth();
          // console.log(tempMonth);
          if (tempMonth <= currentMonth) {
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
          } else {
            const joiningMonth = new Date(user.tempDate).getMonth();
            const monthChange = 11 - joiningMonth + currentMonth + 1;
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
      // console.log(newdate);
      const yearBegins = new Date(dateObj.getFullYear(), 0, 1);
      const janYear = yearBegins.getFullYear();
      const firstOfJan = janYear + "/" + 1 + "/" + 1;
      // console.log(firstOfJan);
      if (newdate === firstOfJan) {
        await Staff.updateMany(
          { type: "Regular" },
          {
            regularStaffLeaves: 12,
          }
        );
      }
      return res.status(200).json({ user, success: true });
    }
    return res.status(200).json({ user, success: true });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
