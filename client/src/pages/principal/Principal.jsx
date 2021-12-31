import React from "react";
import "../../index.css";
import { useContext, useEffect } from "react";
import { Table } from "react-bootstrap";
import LeaveContext from "../../context/LeaveContext";
import { useNavigate } from "react-router-dom";

function Principal() {
  const navigate = useNavigate();

  const userContext = useContext(LeaveContext);

  const { userArr, getusers } = userContext;

  useEffect(() => {
    if (userDets?.role !== "Principal" || localUserDetails === null) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getusers();
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

  return (
    <>
      <div className="container">
        <h1>Jain College of Engineering Staff Details</h1>
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
                  <td>{user.staffId}</td>
                  <td>{user.staffName}</td>
                  <td>{user.email}</td>
                  <td>{user.phnumber}</td>
                  <td>{user.role}</td>
                  <td>{user.type}</td>
                  <td>
                    {user.type === "Regular" ? (
                      <span>{user.earnedLeaves + user.regularStaffLeaves}</span>
                    ) : (
                      <span>{user.probationStaffLeaves}</span>
                    )}
                  </td>
                  <td>
                    <span>{user.department}</span>{" "}
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

export default Principal;
