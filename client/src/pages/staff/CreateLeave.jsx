import { useContext, useEffect, useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import LeaveContext from "../../context/LeaveContext";
import "../../index.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
  const [formErrors, setFormErrors] = useState({});

  const [leaveData, setLeaveData] = useState({
    userId: userDets?._id,
    department: userDets?.department,
    name: userDets?.staffName,
  });
  useEffect(() => {
    let start = new Date(leaveData.dateStart);
    let finish = new Date(leaveData.dateEnd);
    let dayMilliseconds = 1000 * 60 * 60 * 24;
    let weekendDays = 0;
    let totalDays = 0;
    while (start <= finish) {
      let day = start.getDay();
      if (day === 0) {
        weekendDays++;
      }
      totalDays++;
      start = new Date(+start + dayMilliseconds);
    }
    let leaveCount = totalDays - weekendDays;
    setTotalLeaveDays(leaveCount);

    setLeaveData({ ...leaveData, noOfDays: leaveCount });

    if (dateStartState !== null) {
      setIsEndDateDisabled(false);
    } else {
      setIsEndDateDisabled(true);
    }

    if (userDets.type === "Regular") {
      if (
        totalLeaveDays > userDets.regularStaffLeaves &&
        totalLeaveDays > userDets.earnedLeaves
      ) {
        setisSubmitDisabled(true);
      } else {
        setisSubmitDisabled(false);
      }
    } else if (userDets.type === "Probation") {
      if (totalLeaveDays > userDets.probationStaffLeaves) {
        setisSubmitDisabled(true);
      } else {
        setisSubmitDisabled(false);
      }
    }
    // eslint-disable-next-line
  }, [dateEndState, dateStartState, totalLeaveDays]);
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
        leaveData.subStaff
      )
    )
      return;

    const res = await postLeaveDetails(leaveData);
    console.log(res);
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
    (user) => user?.role === "Staff" && user?.staffName !== userDets?.staffName
  );
  const clearFields = (e) => {
    Array.from(e.target).forEach((e) => (e.value = ""));
    setLeaveData({
      userId: userDets?._id,
      department: userDets?.department,
      name: userDets?.staffName,
    });
    setTotalLeaveDays(0);
  };

  return (
    <>
      {userDets.type === "Regular" ? (
        userDets.regularStaffLeaves + userDets.earnedLeaves !== 0 ? (
          <div className="container leaveForm">
            <h1>Apply for a new leave</h1>
            <hr />
            <Form onSubmit={sendLeaveDetails}>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label className="fs-3">Subject</Form.Label>
                <Form.Control
                  name="subject"
                  onChange={changeInputHandler}
                  type="text"
                />
                <p className="text-danger">{formErrors.subject}</p>
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label className="fs-3">Description</Form.Label>
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
                  <option value={"Earned"}>Earned</option>
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
                  disabled={isEndDateDisabled}
                />
                <span className="text-danger">{formErrors.dateEnd}</span>

                <label className=" ms-2 fs-4">
                  Number of days: {totalLeaveDays}
                </label>
                <span
                  className="ms-2 fs-5"
                  id="noOfDays"
                  name="noOfDays"
                ></span>
              </div>

              <FloatingLabel
                className="mt-3"
                controlId="floatingSelect"
                label="Select a substitute staff"
              >
                <Form.Select
                  name="subStaff"
                  onChange={changeInputHandler}
                  aria-label="Floating label select example"
                >
                  <option></option>
                  {filteredArr.map((user) => {
                    return (
                      <option key={user.staffId} value={user.staffName}>
                        {user.staffName}
                      </option>
                    );
                  })}
                </Form.Select>
                <p className="text-danger">{formErrors.subStaff}</p>
              </FloatingLabel>

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
        ) : (
          "No leaves remaining"
        )
      ) : userDets.probationStaffLeaves !== 0 ? (
        <div className="container leaveForm">
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
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label className="fs-3">Description</Form.Label>
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
                <option value={"Earned"}>Earned</option>
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
              <p className="text-danger">{formErrors.dateStart}</p>

              <label className=" ms-2 fs-4">End date:</label>
              <input
                name="dateEnd"
                onChange={changeInputHandler}
                className="mb-1"
                type="date"
                disabled={isEndDateDisabled}
              />
              <p className="text-danger">{formErrors.dateEnd}</p>

              <label className=" ms-2 fs-4">
                Number of days: {totalLeaveDays}
              </label>
              <span className="ms-2 fs-5" id="noOfDays" name="noOfDays"></span>
            </div>

            <FloatingLabel
              className="mt-3"
              controlId="floatingSelect"
              label="Select a substitute staff"
            >
              <Form.Select
                name="subStaff"
                onChange={changeInputHandler}
                aria-label="Floating label select example"
              >
                <option></option>
                {filteredArr.map((user) => {
                  return (
                    <option key={user.staffId} value={user.staffName}>
                      {user.staffName}
                    </option>
                  );
                })}
              </Form.Select>
              <p className="text-danger">{formErrors.subStaff}</p>
            </FloatingLabel>

            <Button
              variant="primary"
              className="mt-4"
              disabled={isSubmitDisabled}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </div>
      ) : (
        <h1>No Leaves Remaining</h1>
      )}
    </>
  );
}

export default CreateLeave;
