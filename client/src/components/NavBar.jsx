import { useState } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import "../index.css";
import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const localUserDetails = JSON.parse(localStorage.getItem("storedUser"));
  const userDets = localUserDetails?.user;
  const navigate = useNavigate();

  const [passwordDetails, setPasswordDetails] = useState({});
  const password = useRef();
  const passwordAgain = useRef();

  const changeHandler = (e) => {
    setPasswordDetails({ ...passwordDetails, [e.target.name]: e.target.value });
  };

  const changePasswordSubmit = async (e) => {
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("passwords dont match");
    } else {
      try {
        const json = await axios.put(
          `http://localhost:4000/api/staff/${userDets._id}`,
          passwordDetails
        );
        if (json.data.success) {
          console.log(json.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand className="mx-4" href="#home">
          Leave management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <strong className="navbar-text">
              Hello, {userDets?.staffName}
            </strong>
          </Nav>
        </Navbar.Collapse>

        <Button
          className="d-flex mx-4"
          variant="primary"
          onClick={() => {
            localStorage.removeItem("storedUser");
            navigate("/login");
          }}
        >
          Logout
        </Button>

        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Change Password
        </button>

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
                <label>New Password:</label>
                <input
                  name="password"
                  onChange={changeHandler}
                  type="password"
                  className="pwdBox"
                  ref={password}
                />
                <label>New Password again:</label>
                <input ref={passwordAgain} type="password" className="pwdBox" />
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
                  data-bs-dismiss="modal"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </Navbar>
    </>
  );
}

export default NavBar;
