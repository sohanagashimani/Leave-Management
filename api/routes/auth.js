const router = require("express").Router();
const bcrypt = require("bcrypt");
const Staff = require("../models/Staff");

// create a staff
router.post("/register", async (req, res) => {
  try {
    let user = await Staff.findOne({ email: req.body.email });
    if (user) {
      return res.status(200).json({
        success: false,
        msg: "sorry a user with this email already exists",
      });
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
      isAdmin: req.body.isAdmin,
    });
    // console.log(newUser);
    // save user and send response
    const saved = await user.save();
    success = true;
    return res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await Staff.findOne({
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
      const joiningMonth = user.joiningDate.getMonth();
      const joiningYear = user.joiningDate.getFullYear();
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const typeChange = currentYear - joiningYear;
      const probationLeaves = currentMonth - joiningMonth;
      if (typeChange !== 0) {
        await Staff.findByIdAndUpdate(user._id, {
          type: "Regular",
        });
        return res.status(200).json({ user, success: true });
      } else {
        await Staff.findByIdAndUpdate(user._id, {
          probationStaffLeaves: probationLeaves,
        });
        return res.status(200).json({ user, success: true });
      }
    }
    // Todo
    //  else {
    //   const joiningYear = user.joiningDate.getFullYear();
    //   const currentYear = new Date().getFullYear();
    //   if(joiningYear!==currentYear){
    //   }
    //   await findByIdAndUpdate(user._id, {
    //     regularStaffLeaves: updatedLeaves,
    //   });
    // }
    res.status(200).json({ user, success: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
