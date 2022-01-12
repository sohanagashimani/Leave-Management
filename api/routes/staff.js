const router = require("express").Router();
const Staff = require("../models/Staff");
const bcrypt = require("bcrypt");
const Leave = require("../models/Leave");
// update a user
router.put("/:id", async (req, res) => {
  if (req.body.oldPassword && req.body.password) {
    let user = await Staff.findById(req.params.id);
    const validPassword = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );
    if (validPassword) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
          user = await Staff.findByIdAndUpdate(req.params.id, {
            password: req.body.password,
          });
          return res
            .status(200)
            .json({ message: "acccount has been updated", success: true });
        } catch (err) {
          return res.status(500).json(err);
        }
      }
    } else {
      return res
        .status(200)
        .json({ message: "Incorrect Password", success: false });
    }
  } else {
    return res
      .status(200)
      .json({ message: "Please check the credentials", success: false });
  }
});

// get users
router.get("/fetchusers", async (req, res) => {
  try {
    const users = await Staff.find({}, { password: 0 });

    res.status(200).json(users);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    await Leave.deleteMany({ userId: userId });
    await Staff.findByIdAndDelete(userId);
    res.status(200).json("User successfully deleted");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await Staff.findById(req.params.id);

    const { password, updatedAt, isAdmin, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
