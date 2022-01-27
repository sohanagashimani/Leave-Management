import { useEffect } from "react";
import { Card } from "react-bootstrap";
import logo from "./user.png";

import { useNavigate } from "react-router-dom";
function UserProfile() {
  const localUserDetails = JSON.parse(localStorage.getItem("storedUser"));
  const userDets = localUserDetails?.user;
  const navigate = useNavigate();
  useEffect(() => {
    if (!userDets) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div
        className="profileWrapper"
        style={{ display: "flex", justifyContent: "center", marginTop: "5rem" }}
      >
        <Card style={{ width: "25rem" }}>
          <Card.Img className="profileIcon" variant="top" src={logo} />
          <Card.Body>
            <Card.Title>
              <strong>Staff ID</strong>: {userDets?.staffId}
            </Card.Title>
            <Card.Title>
              <strong>Designation</strong>: {userDets?.designation}
            </Card.Title>
            <Card.Title>
              <strong>Name</strong>: {userDets?.staffName}
            </Card.Title>
            <Card.Title>
              <strong>Phone Number</strong>: {userDets?.phnumber}
            </Card.Title>
            <Card.Title>
              <strong>Email</strong>: {userDets?.email}
            </Card.Title>
            <Card.Title>
              <strong>Role</strong>: {userDets?.role}
            </Card.Title>
            <Card.Title>
              <strong>Joining date</strong>:{" "}
              {new Date(userDets?.joiningDate).toDateString()}
            </Card.Title>
            {userDets?.type !== "Regular" ? (
              <Card.Title>
                <strong>Probation leaves remaining</strong>:{" "}
                {userDets?.probationStaffLeaves}
              </Card.Title>
            ) : (
              <>
                <Card.Title>
                  <strong>Leaves remaining</strong>:{" "}
                  {userDets?.regularStaffLeaves}
                </Card.Title>
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default UserProfile;
