import LeaveRequest from "../../components/LeaveRequest";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Staff() {
  const navigate = useNavigate();
  // const localUserDetails = JSON.parse(localStorage.getItem("storedUser"));
  // const userDets = localUserDetails?.user;
  useEffect(() => {
    if (!localStorage.getItem("storedUser")) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <LeaveRequest />
    </>
  );
}

export default Staff;
