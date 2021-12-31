import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Row, Col, FloatingLabel, Table } from "react-bootstrap";
import { useContext } from "react";
import LeaveContext from "../../context/LeaveContext";
import DeleteOutlineTwoToneIcon from "@mui/icons-material/DeleteOutlineTwoTone";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Create() {
  const [userChange, setuserChange] = useState(false);
  const [isDisabled, setisDisabled] = useState(true);
  const [user, setUser] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const userContext = useContext(LeaveContext);
  const { getusers, userArr, deleteUser } = userContext;

  const navigate = useNavigate();
  const localUserDetails = JSON.parse(localStorage.getItem("storedUser"));
  const userDets = localUserDetails?.user;
  useEffect(() => {
    if (userDets?.role !== "Admin" || localUserDetails === null) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);
  const validate = (values) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phregex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;

    const errors = {};
    if (!values.staffId) {
      errors.staffId = "Staff Id is required ";
    }
    if (!values.staffName) {
      errors.staffName = "Staff name  is required ";
    }
    if (!values.email) {
      errors.email = "Email id  is required ";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "Enter a valid email address";
    }
    if (!values.password) {
      errors.password = "Password  is required ";
    }
    if (!values.joiningDate) {
      errors.joiningDate = "Joining date  is required ";
    }
    if (!values.phnumber) {
      errors.phnumber = "Phone number  is required ";
    } else if (!phregex.test(values.phnumber)) {
      errors.phnumber = "Enter a valid phone number";
    }
    if (!values.role) {
      errors.role = "Role is required ";
    }
    if (!values.type) {
      errors.type = "Type  is required ";
    }
    if (values.role !== "Principal") {
      if (!values.department) {
        errors.department = "department  is required ";
      }
    }
    return errors;
  };

  useEffect(() => {
    if (userDets?.role === "Admin") getusers();
    // eslint-disable-next-line
  }, [userChange]);

  const handleClick = async (e) => {
    e.preventDefault();
    setFormErrors(validate(user));
    if (
      !(
        user.staffId &&
        user.staffName &&
        user.email &&
        user.joiningDate &&
        user.password &&
        user.phnumber &&
        user.role &&
        user.type
      )
    )
      return;

    try {
      const json = await axios.post(
        "http://localhost:4000/api/auth/register",
        user
      );

      if (json.data.success === false) {
        toast.error(json.data.msg);
      } else if (json.data.success) {
        toast.success("user successfully created");
      }
    } catch (error) {
      console.log(error);
    }
    setuserChange(!userChange);
  };

  const deleteUserFrontend = async (user) => {
    const deleteResponse = await deleteUser(user._id);
    if (deleteResponse) {
      toast.success(deleteResponse);
    } else {
      toast.error("internal server error");
    }
    setuserChange(!userChange);
  };

  const handleChange = (e) => {
    if (user.role === "Staff" || user.role === "Hod") {
      setisDisabled(false);
    }
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <>
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
                placeholder="Staff Id"
              />
              <p className="text-danger">{formErrors.staffId}</p>
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
                placeholder="Staff Name"
              />
              <p className="text-danger">{formErrors.staffName}</p>
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
                placeholder="Email"
              />
              <p className="text-danger">{formErrors.email}</p>
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
                placeholder="Password"
              />
              <p className="text-danger">{formErrors.password}</p>
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
              />{" "}
              <p className="text-danger">{formErrors.joiningDate}</p>
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
              />
              <p className="text-danger">{formErrors.phnumber}</p>
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
                  <option></option>
                  <option value="Hod">Hod</option>
                  <option value="Staff">Staff</option>
                  <option value="Principal">Principal</option>
                  <option value="Admin">Admin</option>
                </Form.Select>{" "}
                <p className="text-danger">{formErrors.role}</p>
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
                  <option> </option>
                  <option value="Regular">Regular</option>
                  <option value="Probation">Probation</option>
                </Form.Select>{" "}
                <p className="text-danger">{formErrors.type}</p>
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
                  disabled={isDisabled}
                  onChange={handleChange}
                >
                  <option></option>

                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="CIV">CIV</option>
                  <option value="ME">ME</option>
                </Form.Select>{" "}
                <p className="text-danger">{formErrors.department}</p>
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
              <th>Type</th>
              <th>Leaves remaining</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {userArr.map((user) => {
              return (
                <tr key={user.staffId}>
                  {user.role !== "Admin" && (
                    <>
                      <td>{user.staffId}</td>
                      <td>{user.staffName}</td>
                      <td>{user.email}</td>
                      <td>{user.phnumber}</td>
                      <td>{user.role}</td>
                      <td>{user.type}</td>
                      <td>
                        {user.type === "Regular" ? (
                          <span>
                            {user.earnedLeaves + user.regularStaffLeaves}
                          </span>
                        ) : (
                          <span>{user.probationStaffLeaves}</span>
                        )}
                      </td>
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

export default Create;
