import "../../index.css";
import { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import LeaveContext from "../../context/LeaveContext";
import { useNavigate } from "react-router-dom";
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
    if (userDets) requestsForAdmin();
    // eslint-disable-next-line
  }, [userChange]);
  const populateModal = (modalDeets) => {
    setModalDetails(modalDeets);
  };

  return (
    <>
      <div className="container my-5">
        <h1>Incoming leave applications</h1>
        <Table striped bordered hover>
          <thead>
            <tr className="theads">
              <th>Full Name</th>
              <th>Subject</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Accept/Decline</th>
            </tr>
          </thead>
          <tbody>
            {requestsForAdminArr?.map((leaveReq) => {
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
                                  "Admin",
                                  modalDetails.noOfDays
                                );
                                setuserChange(!userChange);
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
                                  "Admin",
                                  modalDetails.noOfDays
                                );
                                setuserChange(!userChange);
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
