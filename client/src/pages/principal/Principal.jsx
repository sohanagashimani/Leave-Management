import React from "react";
import "../../index.css";
import { useContext, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import LeaveContext from "../../context/LeaveContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Principal() {
  const navigate = useNavigate();
  const userContext = useContext(LeaveContext);
  const [userChange, setuserChange] = useState(false);
  const [filteredArr, setFilteredArr] = useState([]);
  const { userArr, getusers } = userContext;
  useEffect(() => {
    if (userDets?.role !== "Principal") {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    async function callUserApi() {
      if (userDets?.role === "Principal") {
        const response = await getusers();
        // console.log(response);
        if (response) {
          setFilteredArr(response);
        } else {
          toast.error("Internal Server Error");
        }
      }
    }
    callUserApi();
    // eslint-disable-next-line
  }, []);
  const localUserDetails = JSON.parse(localStorage.getItem("storedUser"));
  const userDets = localUserDetails?.user;

  const filterDepartment = (e) => {
    // console.log(e.target.value);
    if (e.target.value === "ALL") {
      setFilteredArr(userArr);
    } else {
      let newArr = userArr?.filter(
        (user) => user.department === e.target.value
      );
      setFilteredArr(newArr);
      setuserChange(!userChange);
    }
  };

  return (
    <>
      <div className="container center">
        <h1
          className="my-4 text-center "
          style={{ border: "1px solid black", padding: "1rem" }}
        >
          Jain College of Engineering Staff Details
        </h1>
        <div className="contents">
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
              <option className="dropdown-item" value="CIV">
                CIV
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
          <div style={{ overflowX: "auto" }}>
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
        </div>
      </div>
    </>
  );
}

export default Principal;
