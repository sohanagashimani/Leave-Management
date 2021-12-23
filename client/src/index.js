import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LeaveState from "./context/LeaveState";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <LeaveState>
      <App />
    </LeaveState>
  </React.StrictMode>,

  document.getElementById("root")
);
