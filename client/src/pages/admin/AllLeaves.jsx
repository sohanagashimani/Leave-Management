import { useNavigate } from "react-router-dom";
import LeaveContext from "../../context/LeaveContext";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { toast } from "react-toastify";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import { Table } from "react-bootstrap";

function AllLeaves() {
  const [filteredArr, setFilteredArr] = useState([]);
  const [leaveReqSubStaffDetails, setLeaveReqSubStaffDetails] = useState([]);
  const [allLeavesArr, setAllLeavesArr] = useState([]);
  const [detailedLeaveReq, setDetailedLeaveReq] = useState({});

  const userContext = useContext(LeaveContext);
  const { getAllLeavesforAdmin } = userContext;
  const navigate = useNavigate();
  const localUserDetails = JSON.parse(localStorage.getItem("storedUser"));
  const userDets = localUserDetails?.user;
  useEffect(() => {
    if (userDets?.role !== "Admin" || localUserDetails === null) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    async function callUserApi() {
      if (userDets?.role === "Admin") {
        const response = await getAllLeavesforAdmin();
        // console.log(response);
        if (response) {
          setAllLeavesArr(response);
          setFilteredArr(response);
        } else {
          toast.error("Internal Server Error");
        }
      }
    }
    callUserApi();
    // eslint-disable-next-line
  }, []);

  const filterDepartment = (e) => {
    // console.log(e.target.value);
    if (e.target.value === "ALL") {
      setFilteredArr(allLeavesArr);
    } else {
      let newArr = allLeavesArr?.filter(
        (leave) =>
          //   console.log(leave.department);
          leave.department === e.target.value
      );
      //   console.log(newArr);
      setFilteredArr(newArr);
      //   setuserChange(!userChange);
    }
  };
  const populateSubStaffDetailsModal = (leaveReq) => {
    setLeaveReqSubStaffDetails(leaveReq.subStaffArr);
  };
  const populateDetailedView = (leaveReq) => {
    setDetailedLeaveReq(leaveReq);
  };

  return (
    <>
      <h1 className="allLeavesh1">Staff Leave Data</h1>
      <div className="allLeavesContainer">
        <div className="dropdown">
          <label>Filter staff by department : </label>
          <select
            className="btn btn-light dropdown-toggle"
            onChange={filterDepartment}
            label="Select Department to view staff"
          >
            <option className="dropdown-item" value="ALL">
              ALL
            </option>
            <option className="dropdown-item" value="CSE">
              CSE
            </option>
            <option className="dropdown-item" value="ECE">
              ECE
            </option>
            <option className="dropdown-item" value="EEE">
              EEE
            </option>
            <option className="dropdown-item" value="CIVIL">
              CIVIL
            </option>
            <option className="dropdown-item" value="MECH">
              MECH
            </option>
            <option className="dropdown-item" value="PHY">
              PHY
            </option>
            <option className="dropdown-item" value="CHEM">
              CHEM
            </option>
            <option className="dropdown-item" value="MATH">
              MATH
            </option>
            <option className="dropdown-item" value="OFFICE">
              OFFICE
            </option>
            <option className="dropdown-item" value="MBA">
              MBA
            </option>
            <option className="dropdown-item" value="MCA">
              MCA
            </option>
          </select>
        </div>
        <div style={{ overflowX: "auto", textAlign: "center" }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Designation</th>
                <th>Name</th>
                <th>Type</th>
                <th>Start date</th>
                <th>End date</th>
                <th>Sub staff-status</th>
                <th>Leave Status</th>
                <th>View Leave</th>
              </tr>
            </thead>
            <tbody>
              {[...filteredArr].reverse().map((leaveReq) => {
                return (
                  <tr className="theads" key={leaveReq._id}>
                    <td>{leaveReq.designation}</td>
                    <td>{leaveReq.name}</td>
                    <td>{leaveReq.type}</td>
                    <td>
                      {new Date(leaveReq.dateStart)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        .replace(/ /g, "-")}
                    </td>
                    <td>
                      {new Date(leaveReq.dateEnd)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        .replace(/ /g, "-")}
                    </td>
                    <td>
                      <>
                        <button
                          type="button"
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#allLeaves"
                          onClick={() => populateSubStaffDetailsModal(leaveReq)}
                        >
                          view
                        </button>

                        <div
                          className="modal fade"
                          id="allLeaves"
                          tabIndex="-1"
                          aria-labelledby="allLeavesLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title" id="allLeavesLabel">
                                  Substitute staff requests
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
                    </td>
                    <td>
                      {leaveReq.byHod === 1 ? (
                        <span className="text-success fw-bold">Approved</span>
                      ) : (
                        leaveReq.byAdmin === 1 && (
                          <span className="text-success fw-bold">Approved</span>
                        )
                      )}
                      {leaveReq.byStaff === 2 && leaveReq.byHod !== 1 && (
                        <span className="text-danger fw-bold">Declined</span>
                      )}
                      {leaveReq.byHod === 2 ? (
                        <span className="text-danger fw-bold">Declined</span>
                      ) : (
                        leaveReq.byAdmin === 2 && (
                          <span className="text-danger fw-bold">Declined</span>
                        )
                      )}
                    </td>
                    <td>
                      <>
                        <button
                          type="button"
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#viewInDetailForAdmin"
                          onClick={() => populateDetailedView(leaveReq)}
                        >
                          view
                        </button>

                        <div
                          className="modal fade"
                          id="viewInDetailForAdmin"
                          tabIndex="-1"
                          aria-labelledby="viewInDetailLabelforadmin"
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
    </>
  );
}

export default AllLeaves;
