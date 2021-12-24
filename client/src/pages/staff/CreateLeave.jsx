import { useContext, useEffect, useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import LeaveContext from "../../context/LeaveContext";
import "../../index.css";
import { useNavigate } from "react-router-dom";

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
    getusers();
    // eslint-disable-next-line
  }, [userChange]);
  const userContext = useContext(LeaveContext);
  const { userArr, getusers, postLeaveDetails } = userContext;
  const sendLeaveDetails = (e) => {
    e.preventDefault();

    console.log(leaveData);
    postLeaveDetails(leaveData);
    setuserChange(!userChange);
    clearFields(e);
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
    setLeaveData({});
  };

  return (
    <>
      {userDets.type === "Regular" ? (
        userDets.regularStaffLeaves || userDets.earnedLeaves !== 0 ? (
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
              </FloatingLabel>
              <div>
                <label className="me-2 fs-4">Start date:</label>
                <input
                  name="dateStart"
                  onChange={changeInputHandler}
                  className="mb-1"
                  type="date"
                />
                <label className=" ms-2 fs-4">End date:</label>
                <input
                  name="dateEnd"
                  onChange={changeInputHandler}
                  className="mb-1"
                  type="date"
                  disabled={isEndDateDisabled}
                />
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
          "fjlds"
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
            </FloatingLabel>
            <div>
              <label className="me-2 fs-4">Start date:</label>
              <input
                name="dateStart"
                onChange={changeInputHandler}
                className="mb-1"
                type="date"
              />
              <label className=" ms-2 fs-4">End date:</label>
              <input
                name="dateEnd"
                onChange={changeInputHandler}
                className="mb-1"
                type="date"
                disabled={isEndDateDisabled}
              />
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
