import { useEffect } from "react";
import { Card } from "react-bootstrap";

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
        style={{ display: "flex", justifyContent: "center", marginTop: "5rem" }}
      >
        <Card style={{ width: "25rem" }}>
          <Card.Img
            variant="top"
            src="https://nd.net/wp-content/uploads/2016/04/profile-dummy.png"
            style={{
              width: "25rem",
              height: "25rem",
            }}
          />
          <Card.Body>
            <Card.Title>Name: {userDets?.staffName}</Card.Title>
            <Card.Title>Staff ID: {userDets?.staffId}</Card.Title>
            <Card.Title>Phone Number: {userDets?.phnumber}</Card.Title>
            <Card.Title>Email: {userDets?.email}</Card.Title>
            <Card.Title>Role: {userDets?.role}</Card.Title>
            <Card.Title>
              Joining date: {new Date(userDets?.joiningDate).toDateString()}
            </Card.Title>
            {userDets?.type !== "Regular" ? (
              <Card.Title>
                Probation leaves remaining: {userDets?.probationStaffLeaves}
              </Card.Title>
            ) : (
              <>
                <Card.Title>
                  Regular leaves remaining: {userDets?.regularStaffLeaves}
                </Card.Title>
                <Card.Title>
                  Earned leaves remaining: {userDets?.earnedLeaves}
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
