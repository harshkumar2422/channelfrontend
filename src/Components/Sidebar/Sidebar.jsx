import React from "react";
import "./Sidebar.css";
import logovpvv from "../../logo-vpvv.png";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <>
      <div className="Sidebar-container">
        <div className="sidebar-logo-profilename">
          <img
            src={logovpvv}
            alt="vpvv"
            srcset=""
            style={{ height: "125px" }}
          />
          <p>VPVV</p>
        </div>
        <div className="sidebar-list">
          <ul>
            <NavLink to="/company-form">
              <li>Identity Registration</li>
            </NavLink>
            <NavLink to="/company-list">
              <li>Registered Companies</li>
            </NavLink>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
