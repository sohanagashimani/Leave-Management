import React from "react";
import "../../index.css";
import { useContext, useEffect } from "react";
import { Table } from "react-bootstrap";
import LeaveContext from "../../context/LeaveContext";
import { useNavigate } from "react-router-dom";

function Principal() {
  const navigate = useNavigate();
  const userContext = useContext(LeaveContext);
  const { userArr, getusers, getAllLeaves, allLeavesArr } = userContext;
  useEffect(() => {
    if (userDets?.role !== "Principal" || localUserDetails === null) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getusers();
    getAllLeaves();

    // eslint-disable-next-line
  }, []);
  const localUserDetails = JSON.parse(localStorage.getItem("storedUser"));
  const userDets = localUserDetails?.user;

  useEffect(() => {
    if (userDets?.role !== "Principal") {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const todaysDate = new Date();

  let updatedArr = [];
  allLeavesArr?.forEach((leave) => {
    const startDateObj = new Date(leave.dateStart);
    const endDateObj = new Date(leave.dateEnd);

    if (
      todaysDate.getDate() <= endDateObj.getDate() &&
      todaysDate.getDate() >= startDateObj.getDate()
    ) {
      updatedArr.push(leave);
    }
  });

  console.log(updatedArr);

  return (
    <>
      <div className="container center">
        <div className="card my-4" style={{ width: "20rem", margin: "auto" }}>
          <div className="card-header">{new Date().toDateString()}</div>
          <ul className="list-group list-group-flush">
            <a
              className="list-group-item "
              data-bs-toggle="collapse"
              href="#collapseExample"
              role="button"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              Number of staff on leave today: {updatedArr.length}
            </a>
            <div className="collapse" id="collapseExample">
              <div
                className="card card-body"
                style={{ padding: "0.1rem 0 0.1rem 0" }}
              >
                {updatedArr.map((item) => {
                  return (
                    <ul
                      className="list-group list-group-flush "
                      key={item.name}
                    >
                      <li
                        className="list-group-item"
                        style={{ textAlign: "left" }}
                      >
                        <span>{item?.name}</span>
                      </li>
                    </ul>
                  );
                })}
              </div>
            </div>
          </ul>
        </div>
        <h1 className="my-4 text-center">
          Jain College of Engineering Staff Details
        </h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Full Name</th>
              <th>Email </th>
              <th>Phone Number</th>
              <th>Role</th>
              <th>Type</th>
              <th>Leaves remaining</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {userArr.map((user) => {
              return (
                <tr key={user.staffId}>
                  {user.role !== "Principal" && user.role !== "Admin" && (
                    <>
                      <td>{user.staffId}</td>
                      <td>{user.staffName}</td>
                      <td>{user.email}</td>
                      <td>{user.phnumber}</td>
                      <td>{user.role}</td>
                      <td>{user.type}</td>
                      <td>
                        {user.type === "Regular" ? (
                          <span>
                            {user.earnedLeaves + user.regularStaffLeaves}
                          </span>
                        ) : (
                          <span>{user.probationStaffLeaves}</span>
                        )}
                      </td>
                      <td>
                        <span>{user.department}</span>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default Principal;
