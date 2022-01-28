import React from "react";
import { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import LeaveContext from "../../context/LeaveContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ViewStaff() {
  const navigate = useNavigate();
  const userContext = useContext(LeaveContext);
  const [filteredArr, setFilteredArr] = useState([]);
  const { getusers } = userContext;
  const localUserDetails = JSON.parse(localStorage.getItem("storedUser"));
  const userDets = localUserDetails?.user;
  useEffect(() => {
    if (userDets?.role !== "Hod") {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    async function callUserApi() {
      if (userDets?.role === "Hod") {
        const response = await getusers();
        if (response) {
          let newArr = response?.filter(
            (user) => user.department === userDets.department
          );
          setFilteredArr(newArr);
        } else {
          toast.error("Internal Server Error");
        }
      }
    }
    callUserApi();

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <h1 className="my-4 text-center">{userDets.department} Staff</h1>
      <div
        className="container center"
        style={{
          overflowX: "auto",
        }}
      >
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Designation</th>
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
            {filteredArr.map((user) => {
              return (
                <tr key={user.staffId}>
                  {user.role !== "Principal" && user.role !== "Admin" && (
                    <>
                      <td>{user.staffId}</td>
                      <td>{user.designation}</td>
                      <td>{user.staffName}</td>
                      <td>{user.email}</td>
                      <td>{user.phnumber}</td>
                      <td>{user.role}</td>
                      <td>{user.type}</td>
                      <td>
                        {user.type === "Regular" ? (
                          <span>
                            {user.regularStaffLeaves}
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

export default ViewStaff;
