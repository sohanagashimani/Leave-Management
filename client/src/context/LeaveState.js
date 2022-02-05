import axios from "axios";

import { useState } from "react";
import LeaveContext from "./LeaveContext";

function LeaveState(props) {
  const [userArr, setuserArr] = useState([]);
  const [recievedLeaveArr, setRecievedLeaveArr] = useState([]);
  const [requestedLeavesArr, setRequestedLeavesArr] = useState([]);
  const [requestesForHodArr, setRequestesForHodArr] = useState([]);
  const [requestsForAdminArr, setRequestsForAdminArr] = useState([]);
  const [allLeavesArr, setallLeavesArr] = useState([]);

  const getusers = async () => {
    try {
      const users = await axios.get("api/staff/fetchusers");
      // console.log(users);
      setuserArr(users.data);
      return users.data;
    } catch (error) {
      console.log(error);
    }
  };
  const postLeaveDetails = async (leave) => {
    try {
      const json = await axios.post("api/leave/", leave);

      return json.data;
    } catch (error) {
      console.log(error);
    }
  };
  const staffStatus = async (leaveId, status, role, leaveCount, staffName) => {
    try {
      const json = await axios.put(
        `api/leave/${leaveId}/${status}/${role}/${leaveCount}/${staffName}`
      );
      return json.data;
    } catch (error) {
      console.log(error);
    }
  };
  const deleteUser = async (id) => {
    try {
      const json = await axios.delete(`api/staff/${id}`);

      return json.data;
    } catch (error) {
      console.log(error);
    }
  };
  const deleteLeave = async (id) => {
    try {
      const json = await axios.delete(`api/leave/${id}`);
      return json.data;
    } catch (error) {
      console.log(error);
    }
  };
  const recievedRequests = async (staffname) => {
    try {
      const recievedLeave = await axios.get(`api/leave/staff/${staffname}`);
      setRecievedLeaveArr(recievedLeave.data);
    } catch (error) {
      console.log(error);
    }
  };
  const myRequestedLeaves = async (userId) => {
    try {
      const requestedLeaves = await axios.get(`api/leave/${userId}`);
      // console.log(requestedLeaves,"saddsd");
      setRequestedLeavesArr(requestedLeaves.data);
    } catch (error) {
      console.log(error);
    }
  };
  const requestesForHod = async (dep) => {
    try {
      const reqsForHod = await axios.get(`api/leave/hod/${dep}`);
      setRequestesForHodArr(reqsForHod.data);
    } catch (error) {
      console.log(error);
    }
  };
  const requestsForAdmin = async () => {
    try {
      const reqsForPrincipal = await axios.get(`api/leave/`);
      setRequestsForAdminArr(reqsForPrincipal.data);
    } catch (error) {
      console.log(error);
    }
  };
  const login = async (userDetails) => {
    try {
      const loggedUser = await axios.post("api/auth/login", userDetails, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      localStorage.setItem("storedUser", JSON.stringify(loggedUser.data));
      return loggedUser.data;
    } catch (err) {
      console.log(err);
    }
  };
  const getAllLeaves = async () => {
    try {
      const res = await axios.get(`api/leave/principal/allLeaves`);
      setallLeavesArr(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getAllLeavesforAdmin = async () => {
    try {
      const res = await axios.get(`api/leave/admin/allLeaves`);
      return res.data;
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
        requestsForAdmin,
        requestsForAdminArr,
        login,
        deleteLeave,
        getAllLeaves,
        getAllLeavesforAdmin,
        allLeavesArr,
        setuserArr,
      }}
    >
      {props.children}
    </LeaveContext.Provider>
  );
}

export default LeaveState;
