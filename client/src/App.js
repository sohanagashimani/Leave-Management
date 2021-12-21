import Create from "./pages/admin/Create";
// import LeaveContext from "./context/LeaveContext";
import LeaveState from "./context/LeaveState";
import Login from "./pages/login/Login";
import Principal from "./pages/principal/Principal";
import Staff from "./pages/staff/Staff";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  
  return (
    <LeaveState>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Staff />} />
          <Route path="/admin" element={<Create />} />
          <Route path="/principal" element={<Principal />} />
        </Routes>
      </Router>
    </LeaveState>
  );
}

export default App;
