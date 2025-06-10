import React from "react";
import logovpvv from "../../logo-vpvv.png";
import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";
const AdminSidebar = () => {
  return (
    <>
      <div className="adminSidebar-container">
        <div className="adminsidebar-logo-profilename">
          <img
            src={logovpvv}
            alt="vpvv"
            srcset=""
            style={{ height: "125px" }}
          />
          <p>VPVV</p>
        </div>
        <div className="admin-sidebar-list">
          <ul>
            <NavLink to="/admin/channel-partner">
              <li>Channel Associate</li>
            </NavLink>
            <NavLink to="/admin/all-listed-data">
              <li>Data Inventory</li>
            </NavLink>
            <NavLink to="/admin/addvisitors">
              <li>Add Vistors Entry</li>
            </NavLink>
            <NavLink to="/admin/vistiorentrylog">
              <li>Vistors Entry Log</li>
            </NavLink>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
