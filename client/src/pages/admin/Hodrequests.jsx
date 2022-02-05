import "../../index.css";
import { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import LeaveContext from "../../context/LeaveContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Hodrequests() {
  const navigate = useNavigate();
  const [modalDetails, setModalDetails] = useState({});
  const userContext = useContext(LeaveContext);
  const [userChange, setuserChange] = useState(false);

  const { requestsForAdmin, requestsForAdminArr, staffStatus } = userContext;

  const localUserDetails = JSON.parse(localStorage.getItem("storedUser"));
  const userDets = localUserDetails?.user;
  useEffect(() => {
    if (userDets?.role !== "Admin") {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (userDets.role === "Admin") requestsForAdmin();
    // eslint-disable-next-line
  }, [userChange]);
  const populateModal = (modalDeets) => {
    setModalDetails(modalDeets);
  };
  // console.log(requestsForAdminArr);
  return (
    <>
      <h1 className="text-center mt-4">Incoming leave applications</h1>
      <div className="container mt-3" style={{ overflowX: "auto" }}>
        <Table striped bordered hover className="text-center">
          <thead>
            <tr className="theads">
              <th>Designation</th>
              <th>Full Name</th>
              <th>Type</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Accept/Decline</th>
            </tr>
          </thead>
          <tbody>
            {requestsForAdminArr.map((leaveReq) => {
              return (
                <tr key={leaveReq._id}>
                  <td className="center">{leaveReq.designation}</td>
                  <td className="center">{leaveReq.name}</td>
                  <td className="center">{leaveReq.type}</td>
                  <td className="center">
                    {new Date(leaveReq.dateStart)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")}
                  </td>
                  <td className="center">
                    {new Date(leaveReq.dateEnd)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")}
                  </td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      cursor: "pointer",
                    }}
                  >
                    {leaveReq.byAdmin === 0 ? (
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
                        {leaveReq.byAdmin === 1 ? (
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
                              Type:<span>{modalDetails?.type}</span>
                            </h5>
                            <h5>
                              From:
                              <span>
                                {new Date(modalDetails?.dateStart)
                                  .toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                  .replace(/ /g, "-")}
                              </span>
                            </h5>
                            <h5>
                              To:
                              <span>
                                {new Date(modalDetails?.dateEnd)
                                  .toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                  .replace(/ /g, "-")}
                              </span>
                            </h5>
                            <h5>
                              No. of days:<span>{modalDetails?.noOfDays}</span>
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
                                  "Admin",
                                  modalDetails?.noOfDays
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
                                  "Admin",
                                  modalDetails?.noOfDays
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
        </Table>
      </div>
    </>
  );
}

export default Hodrequests;
