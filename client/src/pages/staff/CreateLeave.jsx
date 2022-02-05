import { useContext, useEffect, useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import LeaveContext from "../../context/LeaveContext";
import "../../index.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import React from "react";
import { MultiSelect } from "react-multi-select-component";

function CreateLeave() {
  const localUserDetails = JSON.parse(localStorage.getItem("storedUser"));
  const navigate = useNavigate();
  const userDets = localUserDetails?.user;
  const [userChange, setuserChange] = useState(false);
  const [totalLeaveDays, setTotalLeaveDays] = useState(0);
  const [dateEndState, setDateEndState] = useState(null);
  const [dateStartState, setDateStartState] = useState(null);
  const [isEndDateDisabled, setIsEndDateDisabled] = useState(true);
  const [isSubmitDisabled, setisSubmitDisabled] = useState(false);
  const [selected, setSelected] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const multipleSubStaff = [];
  const [leaveData, setLeaveData] = useState({
    userId: userDets?._id,
    designation: userDets?.designation,
    department: userDets?.department,
    name: userDets?.staffName,
  });

  //

  useEffect(() => {
    let start = new Date(leaveData.dateStart);
    let finish = new Date(leaveData.dateEnd);
    let dayMilliseconds = 1000 * 60 * 60 * 24;
    let totalDays = 0;
    while (start <= finish) {
      totalDays++;
      start = new Date(+start + dayMilliseconds);
    }
    let leaveCount = totalDays;
    setTotalLeaveDays(leaveCount);

    setLeaveData({ ...leaveData, noOfDays: leaveCount });

    if (dateStartState !== null) {
      setIsEndDateDisabled(false);
    } else {
      setIsEndDateDisabled(true);
    }

    if (userDets?.type === "Regular") {
      if (
        leaveData.type === "Casual" &&
        totalLeaveDays > userDets.regularStaffLeaves
      ) {
        setisSubmitDisabled(true);
      } else {
        setisSubmitDisabled(false);
      }
    } else if (userDets.type === "Probation") {
      if (
        leaveData.type === "Casual" &&
        totalLeaveDays > userDets.probationStaffLeaves
      ) {
        setisSubmitDisabled(true);
      } else {
        setisSubmitDisabled(false);
      }
    }
    // eslint-disable-next-line
  }, [dateEndState, dateStartState, totalLeaveDays, leaveData.type]);
  useEffect(() => {
    if (!userDets) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (userDets) getusers();
    // eslint-disable-next-line
  }, [userChange]);
  const userContext = useContext(LeaveContext);
  const { userArr, getusers, postLeaveDetails } = userContext;

  const sendLeaveDetails = async (e) => {
    e.preventDefault();
    setFormErrors(validate(leaveData));
    if (
      !(
        leaveData.subject &&
        leaveData.body &&
        leaveData.type &&
        leaveData.dateStart &&
        leaveData.dateEnd &&
        leaveData.subStaffArr.length !== 0
      )
    )
      return;
    const res = await postLeaveDetails(leaveData);
    if (res) {
      toast.success(res.msg);
    } else {
      toast.error("Internal server error");
    }
    setuserChange(!userChange);
    clearFields(e);
  };
  const validate = (values) => {
    const errors = {};
    if (!values.subject) {
      errors.subject = "Subject is required";
    }
    if (!values.type) {
      errors.type = "Type is required";
    }
    if (!values.body) {
      errors.body = "Description is required";
    }
    if (!values.dateStart) {
      errors.dateStart = "Start date is required";
    }
    if (!values.subStaff) {
      errors.subStaff = "Substitue staff is required";
    }
    if (!values.dateEnd) {
      errors.dateEnd = "End date is required";
    }
    if (values.subStaffArr.length === 0) {
      errors.subStaffArr = "Select atleast one substitute staff";
    }
    return errors;
  };

  const changeInputHandler = (e) => {
    setLeaveData({ ...leaveData, [e.target.name]: e.target.value });

    if (e.target.name === "dateEnd") {
      setDateEndState(e.target.value);
    }
    if (e.target.name === "dateStart") {
      setDateStartState(e.target.value);
    }
  };

  const filteredArr = userArr.filter(
    (user) =>
      user?.role !== "Principal" &&
      user?.role !== "Admin" &&
      user?.staffName !== userDets?.staffName
  );
  const clearFields = (e) => {
    Array.from(e.target).forEach((e) => (e.value = ""));
    setLeaveData({
      userId: userDets?._id,
      department: userDets?.department,
      name: userDets?.staffName,
    });
    setSelected([]);
    setTotalLeaveDays(0);
  };
  //multiple select code:

  const options = [];
  filteredArr.map((user) => {
    return options.push({
      value: user.staffName,
      label: user.staffName,
    });
  });

  useEffect(() => {
    selected.map((user) => {
      return multipleSubStaff.push({ name: user.value, status: 0 });
    });
    setLeaveData({ ...leaveData, subStaffArr: multipleSubStaff });
    // eslint-disable-next-line
  }, [selected]);

  return (
    <>
      <div className=" leaveForm">
        {/* multiple select related code:  */}

        <h1>Apply for a new leave</h1>
        <hr />
        <Form onSubmit={sendLeaveDetails}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label className="fs-3">Subject</Form.Label>
            <Form.Control
              name="subject"
              onChange={changeInputHandler}
              type="text"
            />
            <p className="text-danger">{formErrors.subject}</p>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label className="fs-3">
              Description{" "}
              <span className="fs-6">
                (Enter all the details of the leave including the reason and
                timings for substitute teachers)
              </span>
            </Form.Label>
            <Form.Control
              onChange={changeInputHandler}
              as="textarea"
              rows={3}
              name="body"
            />
            <p className="text-danger">{formErrors.body}</p>
          </Form.Group>
          <Form.Label className="fs-3">Type of leave</Form.Label>
          <FloatingLabel
            controlId="floatingSelect"
            label="Select type of leave"
          >
            <Form.Select
              aria-label="Floating label select example"
              onChange={changeInputHandler}
              name="type"
            >
              <option></option>
              required
              <option value={"Duty"}>Duty</option>
              <option value={"Casual"}>Casual</option>
            </Form.Select>
            <p className="text-danger">{formErrors.type}</p>
          </FloatingLabel>
          <div>
            <label className="me-2 fs-4">Start date:</label>
            <input
              name="dateStart"
              onChange={changeInputHandler}
              className="mb-1"
              type="date"
            />
            <span className="text-danger">{formErrors.dateStart}</span>

            <label className=" ms-2 fs-4">End date:</label>
            <input
              name="dateEnd"
              onChange={changeInputHandler}
              className="mb-1"
              type="date"
              min={leaveData.dateStart}
              disabled={isEndDateDisabled}
            />
            <span className="text-danger">{formErrors.dateEnd}</span>

            <label className=" ms-2 fs-4">
              Number of days: {totalLeaveDays}
            </label>
            <span className="ms-2 fs-5" id="noOfDays" name="noOfDays"></span>
          </div>
          <label className=" my-2 fs-4">Select substitute staff: </label>
          <MultiSelect
            options={options}
            value={selected}
            hasSelectAll={false}
            onChange={setSelected}
          />
          <p className="text-danger">{formErrors.subStaffArr}</p>

          <Button
            variant="primary"
            disabled={isSubmitDisabled}
            className="mt-4"
            type="submit"
          >
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
}

export default CreateLeave;
