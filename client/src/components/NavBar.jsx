import { useState, useEffect } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import "../index.css";
import { useRef } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function NavBar() {
  const navigate = useNavigate();
  const localUserDetails = JSON.parse(localStorage.getItem("storedUser"));
  useEffect(() => {
    if (!localUserDetails) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);
  const userDets = localUserDetails?.user;

  const [passwordDetails, setPasswordDetails] = useState({});

  const password = useRef();
  const passwordAgain = useRef();
  const [formErrors, setFormErrors] = useState({});
  const validate = (values) => {
    const errors = {};
    if (!values.oldPassword) {
      errors.oldPassword = "Old password is required";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const changeHandler = (e) => {
    setPasswordDetails({ ...passwordDetails, [e.target.name]: e.target.value });
  };
  const changePasswordSubmit = async (e) => {
    setFormErrors(validate(passwordDetails));
    if (passwordAgain.current.value !== password.current.value) {
      toast.warning("New passwords do not match");
    } else {
      try {
        const json = await axios.put(
          `http://localhost:4000/api/staff/${userDets._id}`,
          passwordDetails,
          {
            headers: {
              "content-Type": "application/json",
            },
          }
        );

        if (json.data.success) {
          toast.success("Password updated");
        } else if (passwordDetails.oldPassword && passwordDetails.password) {
          toast.error("Incorrect old password");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      {userDets && (
        <Navbar bg="light" expand="lg">
          <Navbar.Brand
            className="mx-2"
            as={NavLink}
            to={userDets?.role === "Admin" ? "/admin" : "/"}
          >
            Leave management
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            style={{ marginRight: "0.7rem" }}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto mx-2">
              {/* <Nav.Link
                as={NavLink}
                to={userDets?.role === "Admin" ? "/admin" : "/"}
              >
                Home
              </Nav.Link> */}
              {userDets.role !== "Admin" && (
                <Nav.Link as={NavLink} to="/profile">
                  My profile
                </Nav.Link>
              )}
              {userDets?.role === "Principal" && (
                <Nav.Link as={NavLink} to="/principal">
                  View Staff
                </Nav.Link>
              )}

              <Nav.Link
                as={NavLink}
                to={
                  userDets?.role === "Admin" ? "/leaveRequests" : "/createLeave"
                }
              >
                {userDets?.role === "Admin"
                  ? "Incoming Leave Requests"
                  : "Create a new leave"}
              </Nav.Link>

              {userDets?.role === "Hod" && (
                <Nav.Link as={NavLink} to={"/viewStaff"}>
                  View Staff
                </Nav.Link>
              )}
              {userDets?.role === "Admin" && (
                <Nav.Link as={NavLink} to={"/allLeaves"}>
                  View Staff Leaves
                </Nav.Link>
              )}
            </Nav>
            <strong className="navbar-text mx-2 helloNav">
              Hello, {userDets?.designation}. {userDets.staffName}
            </strong>
            <Button
              className="d-flex mx-2 chpwd"
              variant="primary"
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              Logout
            </Button>
            <button
              type="button"
              className="btn btn-primary mx-2 chpwd"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Change Password
            </button>
          </Navbar.Collapse>

          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Change Password
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <label>Old Password:</label>
                  <input
                    name="oldPassword"
                    className="pwdBox"
                    onChange={changeHandler}
                    type="text"
                  />
                  <p className="text-danger">{formErrors.oldPassword}</p>
                  <label>New Password:</label>
                  <input
                    name="password"
                    onChange={changeHandler}
                    type="password"
                    className="pwdBox"
                    ref={password}
                  />
                  <p className="text-danger">{formErrors.password}</p>
                  <label>New Password again:</label>
                  <input
                    ref={passwordAgain}
                    type="password"
                    className="pwdBox"
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={changePasswordSubmit}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Navbar>
      )}
    </>
  );
}

export default NavBar;
