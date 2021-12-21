import React, { useContext, useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import LeaveContext from "../../context/LeaveContext";
import { useNavigate } from "react-router-dom";
function Login() {
  useEffect(() => {
    localStorage.removeItem("storedUser");
    const reloadCount = sessionStorage.getItem("reloadCount");
    if (reloadCount < 1) {
      sessionStorage.setItem("reloadCount", String(reloadCount + 1));
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloadCount");
    }
  }, []);
  const userContext = useContext(LeaveContext);
  const navigate = useNavigate();
  const { login } = userContext;
  const [user, setUser] = useState({});
  const handleOnChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    await login(user);
    const localUserDetails = JSON.parse(localStorage.getItem("storedUser"));
    if (localUserDetails.success) {
      const userDets = localUserDetails.user;
      if (userDets.role === "Staff" || userDets.role === "Hod") {
        navigate("/");
      } else if (userDets.role === "Principal") {
        navigate("/principal");
      } else if (userDets.isAdmin) {
        navigate("/admin");
      }
    } else {
      alert("Wrong credentials, please confirm with the admin.");
    }
  };

  return (
    <div className="loginContainer">
      <div className="container container2 ">
        <Form onSubmit={handleOnSubmit}>
          <Form.Group className="mb-3 " controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              required
              onChange={handleOnChange}
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              onChange={handleOnChange}
              name="password"
              placeholder="Password"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Login;
