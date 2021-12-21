import { Form, FloatingLabel, Button, Table } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import LeaveContext from "../context/LeaveContext";
import "../index.css";

// import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
// import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";

function LeaveRequest() {
  const [userChange, setuserChange] = useState(false);
  const [modalDetails, setModalDetails] = useState({});

  const userContext = useContext(LeaveContext);

  const localUserDetails = JSON.parse(localStorage.getItem("storedUser"));
  const userDets = localUserDetails?.user;

  const {
    userArr,
    getusers,
    postLeaveDetails,
    recievedLeaveArr,
    recievedRequests,
    requestedLeavesArr,
    myRequestedLeaves,
    staffStatus,
    requestesForHod,
    requestesForHodArr,
  } = userContext;
  useEffect(() => {
    getusers();
    // console.log(requestedLeavesArr);
    recievedRequests(userDets?.staffName);
    myRequestedLeaves(userDets?._id);
    if (userDets?.role === "Hod") {
      requestesForHod(userDets?.department);
    }

    // eslint-disable-next-line
  }, [userChange]);

  const filteredArr = userArr.filter(
    (user) => user?.role === "Staff" && user?.staffName !== userDets?.staffName
  );
  //   console.log(requestedLeavesArr, "asdjak");

  const [leaveData, setLeaveData] = useState({
    userId: userDets?._id,
    department: userDets?.department,
    name: userDets?.staffName,
  });

  const changeInputHandler = (e) => {
    setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
  };

  const clearFields = (e) => {
    Array.from(e.target).forEach((e) => (e.value = ""));
  };

  const sendLeaveDetails = (e) => {
    e.preventDefault();
    clearFields(e);

    postLeaveDetails(leaveData);

    setuserChange(!userChange);
  };
  let count = 0;

  const populateModal = (modalDeets) => {
    setModalDetails(modalDeets);
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <div className="container  myRequests">
        <div className="tableRequests">
          <h1>My leave requests</h1>
          <Table striped bordered hover className="mb-5 ">
            <thead>
              <tr className="theads">
                <th>S.No</th>
                <th>Subject</th>
                <th>From</th>
                <th>To</th>
                <th>Staff-status</th>
                <th>Hod-status</th>
                <th>Principal-status</th>
              </tr>
            </thead>
            <tbody>
              {requestedLeavesArr.map((leaveReq) => {
                return (
                  <tr className="theads" key={leaveReq._id}>
                    <td>{(count += 1)}</td>
                    <td>{leaveReq.subject}</td>
                    <td>{new Date(leaveReq.dateStart).toDateString()}</td>
                    <td>{new Date(leaveReq.dateEnd).toDateString()}</td>
                    <td>
                      {leaveReq.byStaff === 0 && (
                        <span className="text-warning fw-bold">Pending...</span>
                      )}
                      {leaveReq.byStaff === 1 && (
                        <span className="text-success fw-bold">Approved</span>
                      )}
                      {leaveReq.byStaff === 2 && (
                        <span className="text-danger fw-bold">Declined</span>
                      )}
                    </td>
                    <td>
                      {leaveReq.byHod === 0 && (
                        <span className="text-warning fw-bold">Pending...</span>
                      )}
                      {leaveReq.byHod === 1 && (
                        <span className="text-success fw-bold">Approved</span>
                      )}
                      {leaveReq.byHod === 2 && (
                        <span className="text-danger fw-bold">Declined</span>
                      )}
                    </td>
                    <td>
                      {leaveReq.byPrincipal === 0 && (
                        <span className="text-warning fw-bold">Pending...</span>
                      )}
                      {leaveReq.byPrincipal === 1 && (
                        <span className="text-success fw-bold">Approved</span>
                      )}
                      {leaveReq.byPrincipal === 2 && (
                        <span className="text-danger fw-bold">Declined</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        <div className="leaveForm">
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
                name="isSick"
              >
                <option></option>
                required
                <option value={true}>Duty</option>
                <option value={false}>Casual</option>
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
              />
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

            <Button variant="primary" className="mt-4" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>

      <div className="recievedRequests">
        <h1>Substitution requests</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Subject</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Accept/Decline</th>
            </tr>
          </thead>
          <tbody>
            {recievedLeaveArr.map((leaveReq) => {
              // console.log(modalDetails?.byStaff);
              return (
                <tr key={leaveReq._id}>
                  <td className="center">{leaveReq.name}</td>
                  <td className="center">{leaveReq.subject}</td>
                  <td className="center">
                    {new Date(leaveReq.dateStart).toDateString()}
                  </td>
                  <td className="center">
                    {new Date(leaveReq.dateEnd).toDateString()}
                  </td>

                  <td
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      cursor: "pointer",
                    }}
                  >
                    {leaveReq.byStaff === 0 ? (
                      <button
                        type="button"
                        // ref={ref}
                        className="btn btn-primary "
                        data-bs-toggle="modal"
                        data-bs-target="#bbb"
                        onClick={() => populateModal(leaveReq)}
                      >
                        View
                      </button>
                    ) : (
                      <span>
                        {leaveReq.byStaff === 1 ? (
                          <span className="text-success">Accepted</span>
                        ) : (
                          <span className="text-danger">Declined</span>
                        )}
                      </span>
                    )}

                    <div
                      className="modal fade"
                      id="bbb"
                      tabIndex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                              Leave request details
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <h5>
                              Name:<span>{modalDetails?.name}</span>
                            </h5>
                            <h5>
                              Subject:<span>{modalDetails?.subject}</span>
                            </h5>
                            <h5>
                              Description:<span>{modalDetails?.body}</span>
                            </h5>
                            <h5>
                              From:
                              <span>
                                {new Date(
                                  modalDetails?.dateStart
                                ).toDateString()}
                              </span>
                            </h5>
                            <h5>
                              To:
                              <span>
                                {new Date(modalDetails?.dateEnd).toDateString()}
                              </span>
                            </h5>
                            <h5>
                              Substitue Staff:{" "}
                              <span>{modalDetails?.subStaff}</span>
                            </h5>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                              onClick={() => {
                                staffStatus(
                                  modalDetails?._id,
                                  1,
                                  userDets?.role
                                );
                              }}
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary"
                              data-bs-dismiss="modal"
                              onClick={() => {
                                staffStatus(
                                  modalDetails?._id,
                                  2,
                                  userDets?.role
                                );
                              }}
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tbody>
            {requestesForHodArr.map((leaveReq) => {
              return (
                <tr key={leaveReq._id}>
                  <td className="center">{leaveReq.name}</td>
                  <td className="center">{leaveReq.subject}</td>
                  <td className="center">
                    {new Date(leaveReq.dateStart).toDateString()}
                  </td>
                  <td className="center">
                    {new Date(leaveReq.dateEnd).toDateString()}
                  </td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      cursor: "pointer",
                    }}
                  >
                    {leaveReq.byHod === 0 ? (
                      <button
                        type="button"
                        // ref={ref}
                        className="btn btn-primary "
                        data-bs-toggle="modal"
                        data-bs-target="#aaa"
                        onClick={() => populateModal(leaveReq)}
                      >
                        View
                      </button>
                    ) : (
                      <span>
                        {leaveReq.byHod === 1 ? (
                          <span className="text-success">Accepted</span>
                        ) : (
                          <span className="text-danger">Declined</span>
                        )}
                      </span>
                    )}
                    <div
                      className="modal fade"
                      id="aaa"
                      tabIndex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                              Leave request details
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <h5>
                              Name:<span>{modalDetails?.name}</span>
                            </h5>
                            <h5>
                              Subject:<span>{modalDetails?.subject}</span>
                            </h5>
                            <h5>
                              Description:<span>{modalDetails?.body}</span>
                            </h5>
                            <h5>
                              From:
                              <span>
                                {new Date(
                                  modalDetails?.dateStart
                                ).toDateString()}
                              </span>
                            </h5>
                            <h5>
                              To:
                              <span>
                                {new Date(modalDetails?.dateEnd).toDateString()}
                              </span>
                            </h5>
                            <h5>
                              Substitue Staff:{" "}
                              <span>{modalDetails?.subStaff}</span>
                            </h5>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                              onClick={() => {
                                staffStatus(
                                  modalDetails._id,
                                  1,
                                  userDets?.role
                                );
                              }}
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary"
                              data-bs-dismiss="modal"
                              onClick={() => {
                                staffStatus(
                                  modalDetails._id,
                                  2,
                                  userDets?.role
                                );
                              }}
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
export default LeaveRequest;
