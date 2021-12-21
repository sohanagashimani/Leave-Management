import React from "react";
import NavBar from "../../components/NavBar";
import "../../index.css";
import { useContext, useEffect } from "react";
import { Table } from "react-bootstrap";
import LeaveContext from "../../context/LeaveContext";
import { useNavigate } from "react-router-dom";

function Principal() {
  const navigate = useNavigate();

  const userContext = useContext(LeaveContext);

  const { requestesForPrincipal, requestesForPrincipalArr } = userContext;

  const localUserDetails = JSON.parse(localStorage.getItem("storedUser"));
  const userDets = localUserDetails?.user;
  useEffect(() => {
    if (userDets?.role !== "Principal") {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    requestesForPrincipal();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <NavBar />
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
            {requestesForPrincipalArr.map((leaveReq) => {
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
