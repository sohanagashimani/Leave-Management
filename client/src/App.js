import Create from "./pages/admin/Create";
import Login from "./pages/login/Login";
import Principal from "./pages/principal/Principal";
import Staff from "./pages/staff/Staff";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hodrequests from "./pages/admin/Hodrequests";
import CreateLeave from "./pages/staff/CreateLeave";
import UserProfile from "./pages/profile/UserProfile";
import NavBar from "./components/NavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewStaff from "./pages/View Staff/ViewStaff";
import { Slide } from "react-toastify";
import AllLeaves from "./pages/admin/AllLeaves";

function App() {
  // hello
  return (
    <>
      <ToastContainer
        position="bottom-right"
        pauseOnHover={false}
        autoClose={1900}
        hideProgressBar={false}
        newestOnTop={false}
        transition={Slide}
        closeOnClick
      />
      <Router>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Staff />} />
          <Route path="/admin" element={<Create />} />
          <Route path="/principal" element={<Principal />} />
          <Route path="/leaveRequests" element={<Hodrequests />} />
          <Route path="/createLeave" element={<CreateLeave />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/viewStaff" element={<ViewStaff />} />
          <Route path="/allLeaves" element={<AllLeaves />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
