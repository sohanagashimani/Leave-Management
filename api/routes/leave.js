const router = require("express").Router();
const nodemailer = require("nodemailer");
const Leave = require("../models/Leave");
const Staff = require("../models/Staff");
// create a leave request
router.post("/", async (req, res) => {
  try {
    const subject = req.body.subject;
    const newLeave = new Leave({
      userId: req.body.userId,
      subject: req.body.subject,
      department: req.body.department,
      type: req.body.type,
      body: req.body.body,
      subStaffArr: req.body.subStaffArr,
      byStaff: req.body.byStaff,
      byHod: req.body.byHod,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      name: req.body.name,
      noOfDays: req.body.noOfDays,
    });
    const names = req.body.subStaffArr.map((user) => {
      return user.name;
    });
    const subStaffEmail = await Promise.all(
      names.map((i) => {
        // console.log(i)
        return Staff.find({ staffName: i });
      })
    );
    const udpatedStaffEmail = [];
    subStaffEmail.map((res) => {
      if (res.length !== 0) {
        res.map((item) => {
          udpatedStaffEmail.push(item);
        });
      }
    });
    const savedLeave = await newLeave.save();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "localhost",
      port: 587,
      secure: false,
      auth: {
        user: "leavems@jainbgm.in", // generated ethereal user
        pass: "j@im1234", // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    // send mail with defined transport object
    udpatedStaffEmail.forEach(async (user) => {
      let info = await transporter.sendMail({
        from: `"Jain College of Engineering" leavems@jainbgm.in`, // sender address
        to: `${user.email}`, // list of receivers
        subject: `New Substitute Request from ${savedLeave.name}`, // Subject line
        html: `<ul style="list-style:none;color:black">
        <li>Name: ${savedLeave.name}.</li>
        <li>Subject: ${savedLeave.subject}.</li>
        <li>Description: ${savedLeave.body}.</li>
        <li>Please visit <a href="#" style="text-decoration: none;color: blue;">Leave-management software</a> to accept/decline the request</li>
    </ul>`, // html body
      });
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });

    res.status(200).json({ savedLeave, msg: "Leave request sent" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a leave
router.delete("/:id", async (req, res) => {
  try {
    await Leave.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ msg: "Leave has been deleted successfully", success: true });
  } catch (err) {
    return res.status(500).json(err);
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

// get admin specific requests(hod's requests)
router.get("/", async (req, res) => {
  try {
    const user = await Staff.find({ role: "Hod" });

    if (!user) return res.status(200).send([], "no hods found");
    const reqForAdmin = await Promise.all(
      user.map((i) => {
        return Leave.find({ userId: i._id, byStaff: 1 });
      })
    );
    // console.log(reqForAdmin);

    const updatedReqForAdmin = [];
    reqForAdmin.map((request) => {
      if (request.length !== 0) {
        request.map((item) => {
          updatedReqForAdmin.push(item);
        });
      }
    });

    if (updatedReqForAdmin.length !== 0) {
      return res.status(200).json(updatedReqForAdmin);
    } else {
      return res.status(200).send([]);
    }
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

//accepted/dec by staff hod and admin
router.put(
  "/:leaveId/:byStaff/:role/:leaveCount/:staffName",
  async (req, res) => {
    try {
      // console.log(req.params.role);
      if (req.params.role === "Staff") {
        const leave = await Leave.findById(req.params.leaveId);
        // console.log(leave);
        leave.subStaffArr.map((user) => {
          if (user.name === req.params.staffName) {
            user.status = Number(req.params.byStaff);
          }
        });
        const user = await Staff.findOne({ staffName: req.params.staffName });
        const hodUserRole = await Staff.findById(leave.userId);
        const hod = await Staff.findOne({
          department: user.department,
          role: "Hod",
        });
        // console.log(hod.email);

        await Leave.findByIdAndUpdate(req.params.leaveId, {
          subStaffArr: leave.subStaffArr,
        });
        const byStaffApprovalBoolean = leave.subStaffArr.every(
          (user) => user.status === 1
        );
        const byStaffDeclinedBoolean = leave.subStaffArr.some(
          (user) => user.status === 2
        );
        const byStaffPendingBoolean = leave.subStaffArr.some(
          (user) => user.status === 0
        );

        if (byStaffApprovalBoolean) {
          byStaffApproval = 1;
          if (hodUserRole === "Staff") {
            let transporter = nodemailer.createTransport({
              service: "gmail",
              host: "localhost",
              port: 587,
              secure: false,
              auth: {
                user: "leavems@jainbgm.in", // generated ethereal user
                pass: "j@im1234", // generated ethereal password
              },
              tls: {
                rejectUnauthorized: false,
              },
            });
            // send mail with defined transport object

            let info = await transporter.sendMail({
              from: `"Jain College of Engineering" leavems@jainbgm.in`, // sender address
              to: `${hod.email}`, // list of receivers
              subject: `New Substitute Request from ${leave.name}`, // Subject line
              html: `<ul style="list-style:none;color:black">
              <li>Subject: ${leave.subject}</li>
              <li>Description: ${leave.body} </li>
              <li>Please visit <a href="#" style="text-decoration: none;color: blue;">Leave-management software</a> to accept/decline the request</li>
          </ul>`, // html body
            });
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          }
        } else if (byStaffDeclinedBoolean && !byStaffPendingBoolean) {
          byStaffApproval = 2;
          await Leave.findById(req.params.leaveId);
          let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "localhost",
            port: 587,
            secure: false,
            auth: {
              user: "leavems@jainbgm.in", // generated ethereal user
              pass: "j@im1234", // generated ethereal password
            },
            tls: {
              rejectUnauthorized: false,
            },
          });
          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: `"Jain College of Engineering" leavems@jainbgm.in`, // sender address
            to: `${user.email}`, // list of receivers
            subject: `Leave Request Declined`, // Subject line
            html: `<p><span>Your leave request has been <b style="color: red;">Declined </b>by one of the substitute staff.</span><br> Please visit <a href="#"
            style="text-decoration: none;color: blue;">Leave-management software</a> for further details.</p>`, // html body
          });
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } else {
          byStaffApproval = 0;
        }

        await Leave.findByIdAndUpdate(req.params.leaveId, {
          byStaff: byStaffApproval,
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
          let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "localhost",
            port: 587,
            secure: false,
            auth: {
              user: "leavems@jainbgm.in", // generated ethereal user
              pass: "j@im1234", // generated ethereal password
            },
            tls: {
              rejectUnauthorized: false,
            },
          });
          // send mail with defined transport object

          let info = await transporter.sendMail({
            from: `"Jain College of Engineering" leavems@jainbgm.in`, // sender address
            to: `${user.email}`, // list of receivers
            subject: `Leave Request Accepted`, // Subject line
            html: `<p><span>Your leave request has been <b style="color: green;">Accepted</b>.</span><br> Visit <a href="#"
            style="text-decoration: none;color: blue;">Leave-management software</a> for further details.</p>`, // html body
          });
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } else if (leaveStatus.byHod === 2) {
          let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "localhost",
            port: 587,
            secure: false,
            auth: {
              user: "leavems@jainbgm.in", // generated ethereal user
              pass: "j@im1234", // generated ethereal password
            },
            tls: {
              rejectUnauthorized: false,
            },
          });
          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: `"Jain College of Engineering" leavems@jainbgm.in`, // sender address
            to: `${user.email}`, // list of receivers
            subject: `Leave Request Declined`, // Subject line
            html: `<p><span>Your leave request has been <b style="color: red;">Declined</b>.</span><br> Visit <a href="#"
            style="text-decoration: none;color: blue;">Leave-management software</a> for further details.</p>`, // html body
          });
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
        if (leaveStatus.byHod === 1 && leaveStatus.type === "Casual") {
          if (user.type === "Regular") {
            const updatedLeaves =
              user.regularStaffLeaves - req.params.leaveCount;
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
        } else if (leaveStatus.byHod === 1 && leaveStatus.type === "Earned") {
          if (user.type === "Regular") {
            const updatedLeaves = user.earnedLeaves - req.params.leaveCount;
            // console.log(updatedLeaves)
            await Staff.findByIdAndUpdate(user._id, {
              earnedLeaves: updatedLeaves,
            });
          }
        }
        return res.status(200).json("leave status approved");
      } else if (req.params.role === "Admin") {
        await Leave.findByIdAndUpdate(req.params.leaveId, {
          byAdmin: req.params.byStaff,
        });
        const leaveStatus = await Leave.findById(req.params.leaveId);
        const userId = await leaveStatus.userId;
        const user = await Staff.findById(userId);
        if (leaveStatus.byAdmin === 1) {
          let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "localhost",
            port: 587,
            secure: false,
            auth: {
              user: "leavems@jainbgm.in", // generated ethereal user
              pass: "j@im1234", // generated ethereal password
            },
            tls: {
              rejectUnauthorized: false,
            },
          });
          // send mail with defined transport object

          let info = await transporter.sendMail({
            from: `"Jain College of Engineering" leavems@jainbgm.in`, // sender address
            to: `${user.email}`, // list of receivers
            subject: `Leave Request Accepted`, // Subject line
            html: `<p><span>Your leave request has been <b style="color: green;">Accepted</b>.</span><br> Visit <a href="#"
            style="text-decoration: none;color: blue;">Leave-management software</a> for further details.</p>`, // html body
          });
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } else if (leaveStatus.byAdmin === 2) {
          let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "localhost",
            port: 587,
            secure: false,
            auth: {
              user: "leavems@jainbgm.in", // generated ethereal user
              pass: "j@im1234", // generated ethereal password
            },
            tls: {
              rejectUnauthorized: false,
            },
          });
          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: `"Jain College of Engineering" leavems@jainbgm.in`, // sender address
            to: `${user.email}`, // list of receivers
            subject: `Leave Request Declined`, // Subject line
            html: `<p><span>Your leave request has been <b style="color: red;">Declined</b>.</span><br> Visit <a href="#"
            style="text-decoration: none;color: blue;">Leave-management software</a> for further details.</p>`, // html body
          });
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
        if (leaveStatus.byAdmin === 1 && leaveStatus.type === "Casual") {
          if (user.type === "Regular") {
            const updatedLeaves =
              user.regularStaffLeaves - req.params.leaveCount;
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
        } else if (leaveStatus.byHod === 1 && leaveStatus.type === "Earned") {
          if (user.type === "Regular") {
            const updatedLeaves = user.earnedLeaves - req.params.leaveCount;
            // console.log(updatedLeaves)
            await Staff.findByIdAndUpdate(user._id, {
              earnedLeaves: updatedLeaves,
            });
          }
        }
        return res.status(200).json("leave status approved");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

// get staff specific leave reqs
router.get("/staff/:staffname", async (req, res) => {
  try {
    const leave = await Leave.find({
      subStaffArr: { $elemMatch: { name: req.params.staffname } },
    });
    res.status(200).json(leave);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get all leaves
router.get("/principal/allLeaves", async (req, res) => {
  try {
    const allLeaves = await Leave.find({ $or: [{ byAdmin: 1 }, { byHod: 1 }] });
    return res.status(200).json(allLeaves);
  } catch (err) {
    console.log(res.status);
    return res.status(500).json(err);
  }
});

module.exports = router;
