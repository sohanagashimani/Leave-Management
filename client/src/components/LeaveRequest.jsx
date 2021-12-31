import { Table } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import LeaveContext from "../context/LeaveContext";
import "../index.css";
import DeleteOutlineTwoToneIcon from "@mui/icons-material/DeleteOutlineTwoTone";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function LeaveRequest() {
  const localUserDetails = JSON.parse(localStorage.getItem("storedUser"));
  const userDets = localUserDetails?.user;

  const [userChange, setuserChange] = useState(false);
  const [modalDetails, setModalDetails] = useState({});

  const userContext = useContext(LeaveContext);
  const navigate = useNavigate();
  const {
    recievedLeaveArr,
    recievedRequests,
    requestedLeavesArr,
    myRequestedLeaves,
    staffStatus,
    requestesForHod,
    requestesForHodArr,
    deleteLeave,
  } = userContext;
  useEffect(() => {
    if (!userDets) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // console.log(requestedLeavesArr);
    if (userDets) {
      recievedRequests(userDets?.staffName);
      myRequestedLeaves(userDets?._id);
    }
    if (userDets?.role === "Hod") {
      requestesForHod(userDets?.department);
    }
    // eslint-disable-next-line
  }, [userChange]);

  const deleteUserFrontend = (leaveReq) => {
    deleteLeave(leaveReq._id);
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
                {userDets.role === "Staff" ? (
                  <th>Hod-status</th>
                ) : (
                  <th>Admin-status</th>
                )}
                <th>Delete</th>
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
                      {userDets.role !== "Hod"
                        ? leaveReq.byHod === 0
                        : leaveReq.byAdmin === 0 && (
                            <span className="text-warning fw-bold">
                              Pending...
                            </span>
                          )}
                      {userDets.role !== "Hod"
                        ? leaveReq.byHod === 1
                        : leaveReq.byAdmin === 1 && (
                            <span className="text-success fw-bold">
                              Approved
                            </span>
                          )}
                      {userDets.role !== "Hod"
                        ? leaveReq.byHod === 2
                        : leaveReq.byAdmin === 2 && (
                            <span className="text-danger fw-bold">
                              Declined
                            </span>
                          )}
                    </td>
                    <td
                      onClick={() => deleteUserFrontend(leaveReq)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                    >
                      <span>
                        <DeleteOutlineTwoToneIcon />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
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
                                  userDets?.role,
                                  modalDetails?.noOfDays
                                );

                                setuserChange(!userChange);
                                toast.info("Accepted");
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
                                  userDets?.role,
                                  modalDetails?.noOfDays
                                );
                                setuserChange(!userChange);

                                toast.info("Declined");
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
                  {leaveReq.userId !== userDets._id && (
                    <>
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
                                <h5
                                  className="modal-title"
                                  id="exampleModalLabel"
                                >
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
                                    {new Date(
                                      modalDetails?.dateEnd
                                    ).toDateString()}
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
                                      userDets?.role,
                                      modalDetails?.noOfDays
                                    );
                                    setuserChange(!userChange);
                                    toast.info("Accepted");
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
                                      userDets?.role,
                                      modalDetails?.noOfDays
                                    );
                                    setuserChange(!userChange);
                                    toast.info("Declined");
                                  }}
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </>
                  )}
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
