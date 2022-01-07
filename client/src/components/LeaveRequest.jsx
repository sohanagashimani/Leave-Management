import { Table } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import LeaveContext from "../context/LeaveContext";
import "../index.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
function LeaveRequest() {
  const localUserDetails = JSON.parse(localStorage.getItem("storedUser"));
  const userDets = localUserDetails?.user;

  const [userChange, setuserChange] = useState(false);
  const [modalDetails, setModalDetails] = useState({});
  const [leaveReqSubStaffDetails, setLeaveReqSubStaffDetails] = useState([]);
  const [detailedLeaveReq, setDetailedLeaveReq] = useState({});

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
  } = userContext;

  useEffect(() => {
    if (userDets?.role === "Admin") {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (userDets?.role === "Staff" || userDets?.role === "Hod") {
      myRequestedLeaves(userDets?._id);
    }
    if (userDets?.role === "Staff") {
      recievedRequests(userDets?.staffName);
    } else if (userDets?.role === "Hod") {
      requestesForHod(userDets?.department);
    }

    // eslint-disable-next-line
  }, [userChange]);

  let count = 0;

  const populateModal = (modalDeets) => {
    setModalDetails(modalDeets);
  };
  const populateSubStaffDetailsModal = (leaveReq) => {
    setLeaveReqSubStaffDetails(leaveReq.subStaffArr);
  };

  const populateDetailedView = (leaveReq) => {
    setDetailedLeaveReq(leaveReq);
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
                {userDets?.role === "Staff" ? (
                  <th>Hod-status</th>
                ) : (
                  <th>Admin-status</th>
                )}
                <th>View Leave</th>
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
                      {leaveReq.byStaff !== 1 && (
                        <>
                          <button
                            type="button"
                            className="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#byStaffApproval"
                            onClick={() =>
                              populateSubStaffDetailsModal(leaveReq)
                            }
                          >
                            view
                          </button>

                          <div
                            className="modal fade"
                            id="byStaffApproval"
                            tabIndex="-1"
                            aria-labelledby="byStaffApprovalLabel"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5
                                    className="modal-title"
                                    id="byStaffApprovalLabel"
                                  >
                                    Your substitute staff requests
                                  </h5>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  ></button>
                                </div>
                                <div className="modal-body">
                                  {leaveReqSubStaffDetails?.map((item) => {
                                    return (
                                      <div
                                        key={item.name}
                                        style={{ display: "flex" }}
                                      >
                                        <h5>
                                          Name:<span>{item?.name}</span>
                                        </h5>
                                        <h5 className="mx-2">
                                          Status:
                                          {(item?.status === 1 && (
                                            <span className="text-success fw-bold">
                                              <CheckCircleOutlineOutlinedIcon />
                                            </span>
                                          )) ||
                                            (item?.status === 0 && (
                                              <span className="text-warning fw-bold">
                                                <PendingIcon />
                                              </span>
                                            )) ||
                                            (item?.status === 2 && (
                                              <span className="text-danger fw-bold">
                                                <CancelIcon />
                                              </span>
                                            ))}
                                        </h5>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {leaveReq.byStaff === 1 && (
                        <span className="text-success fw-bold">Approved</span>
                      )}
                    </td>
                    <td>
                      {userDets.role === "Staff"
                        ? leaveReq.byHod === 0 && (
                            <span className="text-warning fw-bold">
                              Pending...
                            </span>
                          )
                        : leaveReq.byAdmin === 0 && (
                            <span className="text-warning fw-bold">
                              Pending...
                            </span>
                          )}
                      {userDets.role === "Staff"
                        ? leaveReq.byHod === 1 && (
                            <span className="text-success fw-bold">
                              Approved
                            </span>
                          )
                        : leaveReq.byAdmin === 1 && (
                            <span className="text-success fw-bold">
                              Approved
                            </span>
                          )}
                      {userDets.role !== "Hod"
                        ? leaveReq.byHod === 2 && (
                            <span className="text-danger fw-bold">
                              Declined
                            </span>
                          )
                        : leaveReq.byAdmin === 2 && (
                            <span className="text-danger fw-bold">
                              Declined
                            </span>
                          )}
                    </td>
                    <td>
                      <>
                        <button
                          type="button"
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#viewInDetail"
                          onClick={() => populateDetailedView(leaveReq)}
                        >
                          view
                        </button>

                        <div
                          className="modal fade"
                          id="viewInDetail"
                          tabIndex="-1"
                          aria-labelledby="viewInDetailLabel"
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
                              <div
                                className="modal-body"
                                style={{ textAlign: "left" }}
                              >
                                <h5>
                                  Subject:
                                  <span>{detailedLeaveReq?.subject}</span>
                                </h5>
                                <h5>
                                  Description:
                                  <span>{detailedLeaveReq?.body}</span>
                                </h5>
                                <h5>
                                  Type:
                                  <span>{detailedLeaveReq?.type}</span>
                                </h5>
                                <h5>
                                  From:
                                  <span>
                                    {new Date(
                                      detailedLeaveReq?.dateStart
                                    ).toDateString()}
                                  </span>
                                </h5>
                                <h5>
                                  To:
                                  <span>
                                    {new Date(
                                      detailedLeaveReq?.dateEnd
                                    ).toDateString()}
                                  </span>
                                </h5>
                                <h5>
                                  No. of days:
                                  <span>{detailedLeaveReq?.noOfDays}</span>
                                </h5>
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  data-bs-dismiss="modal"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
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
                    {leaveReq.subStaffArr.some((element) => {
                      if (element.name === userDets.staffName) {
                        if (element.status === 0) return true;
                      }
                      return false;
                    }) ? (
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
                        {leaveReq.subStaffArr.some((user) => {
                          if (user.name === userDets.staffName) {
                            if (user.status === 1) {
                              return true;
                            }
                          }
                          return false;
                        }) ? (
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
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                              onClick={async () => {
                                const res = await staffStatus(
                                  modalDetails?._id,
                                  1,
                                  userDets?.role,
                                  modalDetails?.noOfDays,
                                  userDets?.staffName
                                );
                                if (res) {
                                  setuserChange(!userChange);
                                  toast.info("Accepted");
                                } else {
                                  toast.danger("Internal server error");
                                }
                              }}
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary"
                              data-bs-dismiss="modal"
                              onClick={async () => {
                                const res = await staffStatus(
                                  modalDetails?._id,
                                  2,
                                  userDets?.role,
                                  modalDetails?.noOfDays,
                                  userDets?.staffName
                                );
                                if (res) {
                                  setuserChange(!userChange);
                                  toast.info("Declined");
                                } else {
                                  toast.danger("Internal server error");
                                }
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
                                      modalDetails?.noOfDays,
                                      userDets?.staffName
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
                                      modalDetails?.noOfDays,
                                      userDets?.staffName
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
