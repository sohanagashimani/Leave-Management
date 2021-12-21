import axios from "axios";
import { useState } from "react";
import LeaveContext from "./LeaveContext";

function LeaveState(props) {
  const [userArr, setuserArr] = useState([]);
  const [recievedLeaveArr, setRecievedLeaveArr] = useState([]);
  const [requestedLeavesArr, setRequestedLeavesArr] = useState([]);
  const [requestesForHodArr, setRequestesForHodArr] = useState([]);
  const [requestesForPrincipalArr, setRequestesForPrincipalArr] = useState([]);

  const getusers = async () => {
    try {
      const users = await axios.get(
        "http://localhost:4000/api/staff/fetchusers"
      );
      setuserArr(users.data);
    } catch (error) {
      console.log(error);
    }
  };
  const postLeaveDetails = async (leave) => {
    try {
      axios.post("http://localhost:4000/api/leave/", leave);
    } catch (error) {
      console.log(error);
    }
  };
  const staffStatus = async (leaveId, status, role) => {
    try {
      console.log("insideeeeee");
      axios.put(`http://localhost:4000/api/leave/${leaveId}/${status}/${role}`);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/staff/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const recievedRequests = async (staffname) => {
    try {
      const recievedLeave = await axios.get(
        `http://localhost:4000/api/leave/staff/${staffname}`
      );
      setRecievedLeaveArr(recievedLeave.data);
    } catch (error) {
      console.log(error);
    }
  };
  const myRequestedLeaves = async (userId) => {
    try {
      const requestedLeaves = await axios.get(
        `http://localhost:4000/api/leave/${userId}`
      );
      // console.log(requestedLeaves,"saddsd");
      setRequestedLeavesArr(requestedLeaves.data);
    } catch (error) {
      console.log(error);
    }
  };
  const requestesForHod = async (dep) => {
    try {
      const reqsForHod = await axios.get(
        `http://localhost:4000/api/leave/hod/${dep}`
      );
      setRequestesForHodArr(reqsForHod.data);
    } catch (error) {
      console.log(error);
    }
  };
  const requestesForPrincipal = async () => {
    try {
      const reqsForPrincipal = await axios.get(
        `http://localhost:4000/api/leave/`
      );
      setRequestesForPrincipalArr(reqsForPrincipal.data);
    } catch (error) {
      console.log(error);
    }
  };
  const login = async (userDetails) => {
    try {
      const loggedUser = await axios.post(
        "http://localhost:4000/api/auth/login",
        userDetails
      );

      localStorage.setItem("storedUser", JSON.stringify(loggedUser.data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <LeaveContext.Provider
      value={{
        getusers,
        userArr,
        deleteUser,
        postLeaveDetails,
        recievedRequests,
        recievedLeaveArr,
        myRequestedLeaves,
        requestedLeavesArr,
        staffStatus,
        requestesForHod,
        requestesForHodArr,
        requestesForPrincipal,
        requestesForPrincipalArr,
        login,
      }}
    >
      {props.children}
    </LeaveContext.Provider>
  );
}

export default LeaveState;
