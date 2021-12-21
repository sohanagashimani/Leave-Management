import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Row, Col, FloatingLabel, Table } from "react-bootstrap";
import { useContext } from "react";
import LeaveContext from "../../context/LeaveContext";
import DeleteOutlineTwoToneIcon from "@mui/icons-material/DeleteOutlineTwoTone";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";

function Create() {
  const [userChange, setuserChange] = useState(false);
  const [user, setUser] = useState({});
  const userContext = useContext(LeaveContext);
  const { getusers, userArr, deleteUser } = userContext;

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("storedUser")) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getusers();
    // eslint-disable-next-line
  }, [userChange]);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const json = await axios.post(
        "http://localhost:4000/api/auth/register",
        user
      );
      if (json.data.success === false) {
        user.email.current.setCustomValidity("User exists");
      }
    } catch (error) {
      console.log(error);
    }
    setuserChange(!userChange);
  };

  const deleteUserFrontend = (user) => {
    deleteUser(user._id);
    setuserChange(!userChange);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  // console.log(user,"userrr");
  return (
    <>
      <NavBar />
      <div className="container my-5">
        <h1>Create a new staff member</h1>
        <hr />
        <Form onSubmit={handleClick}>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="2">
              Staff ID
            </Form.Label>
            <Col sm="10">
              <Form.Control
                onChange={handleChange}
                name="staffId"
                type="text"
                required
                placeholder="Staff Id"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="2">
              Staff Name
            </Form.Label>
            <Col sm="10">
              <Form.Control
                onChange={handleChange}
                name="staffName"
                type="text"
                required
                placeholder="Staff Name"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="2">
              Email
            </Form.Label>
            <Col sm="10">
              <Form.Control
                onChange={handleChange}
                type="email"
                name="email"
                required
                placeholder="Email"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="2">
              Password
            </Form.Label>
            <Col sm="10">
              <Form.Control
                onChange={handleChange}
                type="Password"
                name="password"
                required
                placeholder="Password"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="2">
              Joining Date
            </Form.Label>
            <Col sm="10">
              <Form.Control
                onChange={handleChange}
                type="date"
                name="joiningDate"
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="2">
              Phone Number
            </Form.Label>
            <Col sm="10">
              <Form.Control
                onChange={handleChange}
                type="tel"
                name="phnumber"
                placeholder="Phone Number"
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="2">
              Role
            </Form.Label>
            <Col sm="10">
              <FloatingLabel controlId="floatingSelect" label="Select a role">
                <Form.Select
                  aria-label="Floating label select example"
                  name="role"
                  onChange={handleChange}
                >
                  required
                  <option></option>
                  <option value="Hod">Hod</option>
                  <option value="Staff">Staff</option>
                  <option value="Principal">Principal</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="2">
              Type
            </Form.Label>
            <Col sm="10">
              <FloatingLabel
                controlId="floatingSelect"
                label="Select type of Staff"
              >
                <Form.Select
                  aria-label="Floating label select example"
                  name="type"
                  onChange={handleChange}
                >
                  required
                  <option> </option>
                  <option value="Regular">Regular</option>
                  <option value="Probation">Probation</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formPlaintextPassword"
          >
            <Form.Label column sm="2">
              Department
            </Form.Label>
            <Col sm="10">
              <FloatingLabel
                controlId="floatingSelect"
                label="Select a department"
              >
                <Form.Select
                  aria-label="Floating label select example"
                  name="department"
                  onChange={handleChange}
                >
                  <option></option>
                  required
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="CIV">CIV</option>
                  <option value="ME">ME</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Form.Group>
          <Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form.Group>
          <hr />
        </Form>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Full Name</th>
              <th>Email </th>
              <th>Phone Number</th>
              <th>Role</th>
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
                  <td
                    onClick={() => deleteUserFrontend(user)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      cursor: "pointer",
                    }}
                  >
                    <span>{user.department}</span>{" "}
                    <span>
                      <DeleteOutlineTwoToneIcon />
                    </span>
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

export default Create;
